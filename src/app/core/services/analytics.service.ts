import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface MonthlyAnalytics {
  month: number;      // 1-12
  monthLabel: string; // e.g. 'Jan', 'Feb'
  income: number;
  outcome: number;
  sales?: number;    // optional overall sales for the month
}

export interface AnalyticsByYear {
  year: number;
  monthly: MonthlyAnalytics[];
  totalIncome: number;
  totalOutcome: number;
  totalSales: number;
}

/** Raw API response; totals and monthLabel may be omitted. */
interface AnalyticsApiResponse {
  year?: number;
  monthly?: Array<{ month: number; monthLabel?: string; income?: number; outcome?: number; sales?: number }>;
  totalIncome?: number;
  totalOutcome?: number;
  totalSales?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiService = inject(ApiService);

  private readonly monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /**
   * Fetches analytics (income, outcome, overall sales) by year for dashboard charts.
   * Backend: GET /api/analytics?year=2022
   * Response can be: { year, monthly: [{ month, income, outcome, sales? }] } — totals and monthLabels are added here if missing.
   */
  getAnalyticsByYear(year: number): Observable<AnalyticsByYear> {
    return this.apiService.get<AnalyticsApiResponse>('/analytics', { year }).pipe(
      map((res) => this.normalizeAnalytics(res, year))
    );
  }

  private normalizeAnalytics(res: AnalyticsApiResponse, year: number): AnalyticsByYear {
    const monthly: MonthlyAnalytics[] = (res.monthly ?? []).map((m) => ({
      month: m.month,
      monthLabel: m.monthLabel ?? this.getMonthLabel(m.month - 1),
      income: m.income ?? 0,
      outcome: m.outcome ?? 0,
      sales: m.sales ?? (m.income ?? 0) - (m.outcome ?? 0)
    }));
    const totalIncome = res.totalIncome ?? monthly.reduce((s, m) => s + m.income, 0);
    const totalOutcome = res.totalOutcome ?? monthly.reduce((s, m) => s + m.outcome, 0);
    const totalSales = res.totalSales ?? monthly.reduce((s, m) => s + (m.sales ?? m.income - m.outcome), 0);
    return {
      year: res.year ?? year,
      monthly,
      totalIncome,
      totalOutcome,
      totalSales
    };
  }

  /**
   * Overall sales summary for the dashboard (same source as analytics, aggregated).
   * Use this when you only need sales totals or a single series.
   */
  getOverallSales(year: number): Observable<AnalyticsByYear> {
    return this.getAnalyticsByYear(year);
  }

  getMonthLabel(monthIndex: number): string {
    return this.monthLabels[monthIndex] ?? '';
  }
}

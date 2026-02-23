import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService, AnalyticsByYear, MonthlyAnalytics } from '../../core/services/analytics.service';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent implements OnInit, OnDestroy, AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private analyticsService = inject(AnalyticsService);

  @ViewChild('chartContainer') chartContainerRef!: ElementRef<HTMLDivElement>;

  analyticsYear = new Date().getFullYear();
  analyticsYears: number[] = [2024, 2023, 2022, 2021];
  analyticsLoading = false;
  analyticsChartOptions: ApexCharts.ApexOptions | null = null;
  private analyticsChartInstance: ApexCharts | null = null;

  ngOnInit(): void {
    this.loadAnalytics();
  }

  ngAfterViewInit(): void {
    if (this.analyticsChartOptions) {
      this.scheduleChartRender();
    }
  }

  ngOnDestroy(): void {
    this.destroyAnalyticsChart();
  }

  onAnalyticsYearChange(year: number): void {
    this.analyticsYear = year;
    this.loadAnalytics();
  }

  private loadAnalytics(): void {
    this.analyticsLoading = true;
    this.destroyAnalyticsChart();
    this.analyticsChartOptions = null;
    this.cdr.markForCheck();

    this.analyticsService.getAnalyticsByYear(this.analyticsYear).subscribe({
      next: (data) => {
        this.analyticsChartOptions = this.buildAnalyticsChartOptions(data);
        this.analyticsLoading = false;
        this.cdr.markForCheck();
        this.scheduleChartRender();
      },
      error: () => {
        this.analyticsChartOptions = this.buildAnalyticsChartOptions(this.getFallbackAnalyticsData());
        this.analyticsLoading = false;
        this.cdr.markForCheck();
        this.scheduleChartRender();
      }
    });
  }

  private scheduleChartRender(): void {
    this.cdr.detectChanges();
    setTimeout(() => this.renderAnalyticsChart(), 50);
  }

  private renderAnalyticsChart(): void {
    const el = this.chartContainerRef?.nativeElement;
    if (!el || !this.analyticsChartOptions) return;
    this.destroyAnalyticsChart();
    this.analyticsChartInstance = new ApexCharts(el, this.analyticsChartOptions);
    this.analyticsChartInstance.render();
  }

  private destroyAnalyticsChart(): void {
    if (this.analyticsChartInstance) {
      this.analyticsChartInstance.destroy();
      this.analyticsChartInstance = null;
    }
  }

  private getFallbackAnalyticsData(): AnalyticsByYear {
    const monthly: MonthlyAnalytics[] = [
      { month: 1, monthLabel: 'Jan', income: 38000, outcome: 29000 },
      { month: 2, monthLabel: 'Feb', income: 29000, outcome: 36000 },
      { month: 3, monthLabel: 'Mar', income: 32000, outcome: 25000 },
      { month: 4, monthLabel: 'Apr', income: 31000, outcome: 46000 },
      { month: 5, monthLabel: 'May', income: 42000, outcome: 32000 },
      { month: 6, monthLabel: 'Jun', income: 29000, outcome: 22000 },
      { month: 7, monthLabel: 'Jul', income: 48000, outcome: 36000 },
      { month: 8, monthLabel: 'Aug', income: 28000, outcome: 32000 }
    ].map((m) => ({ ...m, sales: m.income - m.outcome }));
    return {
      year: this.analyticsYear,
      monthly,
      totalIncome: monthly.reduce((s, m) => s + m.income, 0),
      totalOutcome: monthly.reduce((s, m) => s + m.outcome, 0),
      totalSales: monthly.reduce((s, m) => s + (m.sales ?? 0), 0)
    };
  }

  private buildAnalyticsChartOptions(data: AnalyticsByYear): ApexCharts.ApexOptions {
    const categories = data.monthly.map((m) => m.monthLabel);
    const incomeData = data.monthly.map((m) => m.income);
    const outcomeData = data.monthly.map((m) => m.outcome);
    const maxVal = Math.max(...incomeData, ...outcomeData, 10000);
    const step = 10000;
    const yMax = Math.ceil(maxVal / step) * step;
    const tickCount = yMax / step;

    return {
      series: [
        { name: 'Income', data: incomeData },
        { name: 'Outcome', data: outcomeData }
      ],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: { show: false },
        fontFamily: 'inherit'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      colors: ['#ec4899', '#a855f7'],
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories,
        axisBorder: { show: true },
        axisTicks: { show: true }
      },
      yaxis: {
        min: 0,
        max: yMax,
        tickAmount: tickCount,
        labels: {
          formatter: (val: number) => (val >= 1000 ? `${Math.round(val / 1000)}K` : String(val))
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      }
    };
  }
}

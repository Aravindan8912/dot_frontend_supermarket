import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsService, Payment } from '../../../core/services/payments.service';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsListComponent implements OnInit {
  private paymentsService = inject(PaymentsService);
  private cdr = inject(ChangeDetectorRef);

  payments: Payment[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.paymentsService.getPayments().subscribe({
      next: (list) => {
        this.payments = list;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  trackById(_index: number, payment: Payment): string {
    return payment.id;
  }

  getStatusClass(status: string): Record<string, boolean> {
    const s = (status || '').toLowerCase();
    return {
      'status-pending': s === 'pending',
      'status-confirmed': s === 'confirmed' || s === 'completed' || s === 'success',
      'status-processing': s === 'processing',
      'status-cancelled': s === 'cancelled' || s === 'failed' || s === 'refunded'
    };
  }

  viewPayment(payment: Payment): void {
    console.log('View payment:', payment);
  }

  editPayment(payment: Payment): void {
    console.log('Edit payment:', payment);
  }
}

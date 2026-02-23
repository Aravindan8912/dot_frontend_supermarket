import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  paymentMethod: string;
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private apiService = inject(ApiService);

  getPaymentByOrderId(orderId: string): Observable<Payment> {
    return this.apiService.get<Payment>('/payments', { orderId });
  }

  createPayment(payment: CreatePaymentRequest): Observable<Payment> {
    return this.apiService.post<Payment>('/payments', payment);
  }
}

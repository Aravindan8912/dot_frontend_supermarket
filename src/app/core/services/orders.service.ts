import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Order {
  id: string;
  customerId: string;
  status: string;
  items: OrderItem[];
  total: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customerId: string;
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiService = inject(ApiService);

  getOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>('/orders');
  }

  getOrderById(id: string): Observable<Order> {
    return this.apiService.get<Order>(`/orders/${id}`);
  }

  createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.apiService.post<Order>('/orders', order);
  }
}

import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, Order } from '../../../../core/services/orders.service';

export interface OrderDisplayItem {
  name: string;
  quantity: number;
}

export interface OrderDisplay {
  orderNumber: string;
  customerName: string;
  items: OrderDisplayItem[];
  total: number;
  status: string;
  date: string | Date;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private cdr = inject(ChangeDetectorRef);

  orders: OrderDisplay[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.ordersService.getOrders().subscribe({
      next: (apiOrders: Order[]) => {
        this.orders = apiOrders.map(o => ({
          orderNumber: o.id,
          customerName: o.customerId,
          items: o.items.map(i => ({ name: i.productId, quantity: i.quantity })),
          total: o.total,
          status: o.status,
          date: new Date()
        }));
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  trackByOrderId(_index: number, order: OrderDisplay): string {
    return order.orderNumber;
  }

  trackByItemName(_index: number, item: OrderDisplayItem): string {
    return `${item.name}-${item.quantity}`;
  }

  getStatusClass(status: string): Record<string, boolean> {
    const s = (status || '').toLowerCase();
    return {
      'status-pending': s === 'pending',
      'status-confirmed': s === 'confirmed',
      'status-processing': s === 'processing',
      'status-shipped': s === 'shipped',
      'status-delivered': s === 'delivered',
      'status-cancelled': s === 'cancelled'
    };
  }

  formatDate(value: string | Date): string {
    if (!value) return '';
    const d = typeof value === 'string' ? new Date(value) : value;
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
  }

  viewOrder(order: OrderDisplay): void {
    console.log('View order:', order);
  }
}

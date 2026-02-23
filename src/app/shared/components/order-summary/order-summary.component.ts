import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  image?: string;
}

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderSummaryComponent {
  balance: string = '$12.000';
  address: string = 'Elm Street, 23';
  isOpen: boolean = true;
  
  orderItems: OrderItem[] = [
    { name: 'Pepperoni Pizza', quantity: 1, price: '$5.59' },
    { name: 'Cheese Burger', quantity: 1, price: '$5.59' },
    { name: 'Vegan Pizza', quantity: 1, price: '$5.59' }
  ];

  serviceCharge: string = '$1.00';
  total: string = '$202.00';

  onTopUp(): void {
    console.log('Top up clicked');
  }

  onTransfer(): void {
    console.log('Transfer clicked');
  }

  onCheckout(): void {
    console.log('Checkout clicked');
  }

  trackByOrderItem(index: number, item: OrderItem): string {
    return item.name;
  }

  onClose(): void {
    this.isOpen = false;
  }
}

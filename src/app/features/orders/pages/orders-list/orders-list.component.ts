import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-page">
      <h1>Orders</h1>
      <p>Orders list will be implemented here</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersListComponent {}

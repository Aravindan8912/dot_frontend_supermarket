import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payments-page">
      <h1>Payments</h1>
      <p>Payments list will be implemented here</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsListComponent {}

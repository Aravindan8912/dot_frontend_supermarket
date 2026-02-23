import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="customers-page">
      <h1>Customers</h1>
      <p>Customers list will be implemented here</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersListComponent {}

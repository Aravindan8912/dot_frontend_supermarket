import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="products-page">
      <h1>Products</h1>
      <p>Products list will be implemented here</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent {}

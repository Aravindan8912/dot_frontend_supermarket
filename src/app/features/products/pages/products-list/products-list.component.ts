import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService, Product } from '../../../../core/services/products.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit {
  private productsService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.productsService.getProducts().subscribe({
      next: (list) => {
        this.products = list;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  trackById(_index: number, product: Product): string {
    return product.id;
  }

  viewProduct(product: Product): void {
    console.log('View product:', product);
  }

  editProduct(product: Product): void {
    console.log('Edit product:', product);
  }
}

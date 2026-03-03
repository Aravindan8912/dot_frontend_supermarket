import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductsService, Product } from '../../../core/services/products.service';
import { ApiService } from '../../../core/services/api.service';
import { CategoryOption } from '../../../shared/models/products.models';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './Inventory-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryProductsListComponent implements OnInit {
  private productsService = inject(ProductsService);
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  categories: CategoryOption[] = [];
  isLoading = false;

  lowStockThreshold = 10;
  searchQuery = '';
  selectedCategoryId = '';

  /** Stock status: ≤100 red, 101–2000 orange, >2000 green */
  readonly statusRedMax = 100;
  readonly statusOrangeMax = 2000;

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  get filteredProducts(): Product[] {
    let list = this.products;
    const q = this.searchQuery?.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          (p.category?.name ?? '').toLowerCase().includes(q)
      );
    }
    if (this.selectedCategoryId) {
      list = list.filter(
        (p) => (p.categoryId ?? (p.category as { id?: string })?.id) === this.selectedCategoryId
      );
    }
    return list;
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

  private loadCategories(): void {
    this.apiService.get<Array<{ id?: string; name: string }>>('/categories').subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : (data as { categories?: Array<{ id?: string; name: string }> }).categories ?? [];
        this.categories = list.map((c) => ({ id: c.id ?? c.name, name: c.name }));
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      }
    });
  }

  get lowStockProducts(): Product[] {
    return this.products.filter((p) => p.stock < this.lowStockThreshold);
  }

  trackById(_index: number, product: Product): string {
    return product.id;
  }

  isLowStock(product: Product): boolean {
    return product.stock < this.lowStockThreshold;
  }

  /** Returns 'red' | 'orange' | 'green' based on stock level */
  getStockStatus(product: Product): 'red' | 'orange' | 'green' {
    const s = product.stock;
    if (s <= this.statusRedMax) return 'red';
    if (s <= this.statusOrangeMax) return 'orange';
    return 'green';
  }

  editProduct(product: Product): void {
    // Navigate to products page or open edit dialog as needed
    console.log('Edit product:', product);
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    this.apiService.delete<unknown>(`/products/${product.id}`).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== product.id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to delete product', err);
      }
    });
  }
}

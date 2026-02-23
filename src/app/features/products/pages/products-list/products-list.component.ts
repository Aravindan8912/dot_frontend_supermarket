import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product, CreateProductRequest } from '../../../../core/services/products.service';
import { ApiService } from '../../../../core/services/api.service';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';

interface CategoryOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent],
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent implements OnInit {
  private productsService = inject(ProductsService);
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  categories: CategoryOption[] = [];
  isLoading = false;

  showAddProductDialog = false;
  newProduct: CreateProductRequest = { name: '', price: 0, stock: 0, categoryId: '' };
  addProductSaving = false;
  addProductError: string | null = null;

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
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

  openAddProductDialog(): void {
    this.showAddProductDialog = true;
    this.newProduct = { name: '', price: 0, stock: 0, categoryId: this.categories[0]?.id ?? '' };
    this.addProductError = null;
    this.addProductSaving = false;
    this.cdr.markForCheck();
  }

  closeAddProductDialog(): void {
    this.showAddProductDialog = false;
    this.addProductError = null;
    this.addProductSaving = false;
    this.cdr.markForCheck();
  }

  saveProduct(): void {
    const name = this.newProduct.name?.trim();
    const price = Number(this.newProduct.price);
    const stock = Math.floor(Number(this.newProduct.stock));
    const categoryId = this.newProduct.categoryId?.trim();

    if (!name) {
      this.addProductError = 'Product name is required';
      this.cdr.markForCheck();
      return;
    }
    if (price < 0 || isNaN(price)) {
      this.addProductError = 'Enter a valid price';
      this.cdr.markForCheck();
      return;
    }
    if (stock < 0 || isNaN(stock)) {
      this.addProductError = 'Enter a valid stock';
      this.cdr.markForCheck();
      return;
    }
    if (!categoryId) {
      this.addProductError = 'Please select a category';
      this.cdr.markForCheck();
      return;
    }

    this.addProductError = null;
    this.addProductSaving = true;
    this.cdr.markForCheck();

    this.productsService.createProduct({ name, price, stock, categoryId }).subscribe({
      next: (created) => {
        this.products = [...this.products, created];
        this.closeAddProductDialog();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.addProductSaving = false;
        this.addProductError = err?.error?.message ?? err?.message ?? 'Failed to add product';
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

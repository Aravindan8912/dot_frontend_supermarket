import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  categoryId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiService = inject(ApiService);

  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>('/products');
  }

  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>(`/products/${id}`);
  }

  createProduct(product: CreateProductRequest): Observable<Product> {
    return this.apiService.post<Product>('/products', product);
  }

  updateProduct(id: string, product: Partial<CreateProductRequest>): Observable<Product> {
    return this.apiService.put<Product>(`/products/${id}`, product);
  }
}

import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';
import { AnalyticsComponent } from '../../../analytics/analytics.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiService } from '../../../../core/services/api.service';

export interface Category {
  name: string;
  icon: string;
}

export interface FoodItem {
  name: string;
  price: string;
  image?: string;
  discount?: string;
  rating: number;
  distance?: string;
  deliveryTime?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CategoryCardComponent,
    AnalyticsComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  userEmail: string | null = null;
  userRole: string | null = null;

  categories: Category[] = [];

  showAddCategoryForm = false;
  newCategoryName = '';
  newCategoryIcon = '';
  newCategoryIconFile: File | null = null;
  newCategoryIconPreview: string | null = null;
  addCategoryLoading = false;
  addCategoryError: string | null = null;

  popularDishes: FoodItem[] = [];

  recentOrders: FoodItem[] = [];

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.userRole = this.authService.getUserRole();
    this.loadCategories();
    this.cdr.markForCheck();
  }

  private loadCategories(): void {
    this.apiService.get<Category[]>('/categories').subscribe({
      next: (data) => {
        this.categories = Array.isArray(data) ? data : (data as { categories?: Category[] }).categories ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.cdr.markForCheck();
      }
    });
  }

  openAddCategoryForm(): void {
    this.showAddCategoryForm = true;
    this.newCategoryName = '';
    this.newCategoryIcon = '';
    this.newCategoryIconFile = null;
    this.newCategoryIconPreview = null;
    this.addCategoryError = null;
    this.cdr.markForCheck();
  }

  closeAddCategoryForm(): void {
    this.showAddCategoryForm = false;
    this.newCategoryName = '';
    this.newCategoryIcon = '';
    this.newCategoryIconFile = null;
    this.revokeIconPreview();
    this.newCategoryIconPreview = null;
    this.addCategoryError = null;
    this.addCategoryLoading = false;
    this.cdr.markForCheck();
  }

  private revokeIconPreview(): void {
    if (this.newCategoryIconPreview) {
      URL.revokeObjectURL(this.newCategoryIconPreview);
    }
  }

  onIconFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.revokeIconPreview();
    this.newCategoryIconFile = file ?? null;
    this.newCategoryIconPreview = file ? URL.createObjectURL(file) : null;
    if (!file) this.newCategoryIcon = '';
    this.cdr.markForCheck();
  }

  clearIconFile(): void {
    this.newCategoryIconFile = null;
    this.revokeIconPreview();
    this.newCategoryIconPreview = null;
    this.newCategoryIcon = '';
    this.cdr.markForCheck();
  }

  addCategory(): void {
    const name = this.newCategoryName?.trim();
    if (!name) {
      this.addCategoryError = 'Name is required';
      this.cdr.markForCheck();
      return;
    }
    this.addCategoryError = null;
    this.addCategoryLoading = true;
    this.cdr.markForCheck();

    if (this.newCategoryIconFile) {
      const formData = new FormData();
      formData.set('name', name);
      formData.set('icon', this.newCategoryIconFile);
      this.apiService.postFormData<Category>('/categories', formData).subscribe({
        next: (created) => {
          this.categories = [...this.categories, created];
          this.closeAddCategoryForm();
        },
        error: (err) => {
          this.addCategoryLoading = false;
          this.addCategoryError = err?.error?.message ?? err?.message ?? 'Failed to add category';
          this.cdr.markForCheck();
        }
      });
    } else {
      const icon = this.newCategoryIcon?.trim() ?? '';
      this.apiService.post<Category>('/categories', { name, icon }).subscribe({
        next: (created) => {
          this.categories = [...this.categories, created];
          this.closeAddCategoryForm();
        },
        error: (err) => {
          this.addCategoryLoading = false;
          this.addCategoryError = err?.error?.message ?? err?.message ?? 'Failed to add category';
          this.cdr.markForCheck();
        }
      });
    }
  }

  trackByCategory(index: number, category: Category): string {
    return category.name;
  }

  trackByFoodItem(index: number, item: FoodItem): string {
    return item.name;
  }

  onAddToCart(item: FoodItem): void {
    console.log('Added to cart:', item);
  }

  onToggleFavorite(item: FoodItem): void {
    console.log('Toggle favorite:', item);
  }
}

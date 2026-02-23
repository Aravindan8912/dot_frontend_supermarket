import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { PromoBannerComponent } from '../../../../shared/components/promo-banner/promo-banner.component';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';
import { FoodCardComponent } from '../../../../shared/components/food-card/food-card.component';
import { OrderSummaryComponent } from '../../../../shared/components/order-summary/order-summary.component';
import { AuthService } from '../../../../core/services/auth.service';

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
    SidebarComponent,
    HeaderComponent,
    PromoBannerComponent,
    CategoryCardComponent,
    FoodCardComponent,
    OrderSummaryComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  userEmail: string | null = null;
  userRole: string | null = null;

  categories: Category[] = [
    { name: 'Bakery', icon: 'bakery' },
    { name: 'Burger', icon: 'burger' },
    { name: 'Beverage', icon: 'beverage' },
    { name: 'Chicken', icon: 'chicken' },
    { name: 'Pizza', icon: 'pizza' },
    { name: 'Seafood', icon: 'seafood' }
  ];

  popularDishes: FoodItem[] = [
    { name: 'Fish Burger', price: '$5.59', discount: '15%', rating: 5 },
    { name: 'Beef Burger', price: '$6.99', discount: '10%', rating: 5 },
    { name: 'Cheese Burger', price: '$5.59', rating: 5 }
  ];

  recentOrders: FoodItem[] = [
    { name: 'Fish Burger', price: '$5.59', rating: 5, distance: '4.97 km', deliveryTime: '21 min' },
    { name: 'Japan Ramen', price: '$8.99', rating: 5, distance: '3.2 km', deliveryTime: '15 min' },
    { name: 'Fried Rice', price: '$7.49', rating: 5, distance: '5.1 km', deliveryTime: '25 min' }
  ];

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.userRole = this.authService.getUserRole();
    this.cdr.markForCheck();
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

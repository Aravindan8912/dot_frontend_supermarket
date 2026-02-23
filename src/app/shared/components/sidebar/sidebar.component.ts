import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'home', route: '/admin/dashboard', isActive: true },
    { label: 'Orders', icon: 'shopping-cart', route: '/admin/orders' },
    { label: 'Products', icon: 'package', route: '/admin/products' },
    { label: 'Payments', icon: 'credit-card', route: '/admin/payments' },
    { label: 'Customers', icon: 'users', route: '/admin/customers' },
    { label: 'Order History', icon: 'clock', route: '/admin/order-history' },
    { label: 'Bills', icon: 'receipt', route: '/admin/bills' },
    { label: 'Setting', icon: 'settings', route: '/admin/settings' }
  ];

  trackByMenuItem(index: number, item: MenuItem): string {
    return item.route;
  }

  setActive(item: MenuItem): void {
    this.menuItems.forEach(menu => menu.isActive = false);
    item.isActive = true;
  }
}

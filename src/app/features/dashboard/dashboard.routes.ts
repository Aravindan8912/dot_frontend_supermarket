import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Admin'] }
      },
      {
        path: 'orders',
        loadComponent: () => import('../orders/pages/orders-list/orders-list.component').then(m => m.OrdersListComponent),
        canActivate: [authGuard]
      },
      {
        path: 'order-history',
        loadComponent: () => import('../orders/pages/order-history/order-history.component').then(m => m.OrderHistoryComponent),
        canActivate: [authGuard]
      },
      {
        path: 'products',
        loadComponent: () => import('../products/pages/products-list/products-list.component').then(m => m.ProductsListComponent),
        canActivate: [authGuard]
      },
      {
        path: 'payments',
        loadComponent: () => import('../payments/pages/payments-list/payments-list.component').then(m => m.PaymentsListComponent),
        canActivate: [authGuard]
      },
      {
        path: 'customers',
        loadComponent: () => import('../customers/pages/customers-list/customers-list.component').then(m => m.CustomersListComponent),
        canActivate: [authGuard]
      },
      {
        path: 'settings',
        loadComponent: () => import('../settings/pages/settings-page/settings-page.component').then(m => m.SettingsPageComponent),
        canActivate: [authGuard]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

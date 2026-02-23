# Supermarket Frontend Architecture

## Overview
This Angular application follows a production-ready, scalable architecture with clean code practices, performance optimizations, and seamless integration with a .NET 10 backend using JWT authentication.

## Architecture Principles

### 1. Standalone Components
- ✅ All components are standalone (no NgModules)
- ✅ Each component imports only what it needs
- ✅ Better tree-shaking and smaller bundle sizes

### 2. Feature-Based Architecture
```
src/app/
├── core/           # Core functionality (services, guards, interceptors)
├── shared/         # Shared components and models
├── features/       # Feature modules (auth, dashboard, products, etc.)
└── layouts/        # Layout components
```

### 3. Lazy Loading
- ✅ All routes use lazy loading with `loadComponent()` and `loadChildren()`
- ✅ Reduces initial bundle size
- ✅ Faster application startup

### 4. Change Detection Strategy
- ✅ All components use `OnPush` change detection
- ✅ Manual change detection with `ChangeDetectorRef.markForCheck()`
- ✅ Significant performance improvements

### 5. TrackBy Functions
- ✅ All `*ngFor` loops use `trackBy` functions
- ✅ Prevents unnecessary DOM re-renders
- ✅ Better performance with large lists

## Core Services

### API Service (`core/services/api.service.ts`)
- Centralized HTTP client wrapper
- Uses `environment.apiUrl` for base URL
- Provides typed methods: `get`, `post`, `put`, `delete`, `patch`
- Handles query parameters automatically

### Auth Service (`core/services/auth.service.ts`)
- Manages authentication state
- Token storage and retrieval
- Role-based access methods
- Refresh token handling

### JWT Service (`core/services/jwt.service.ts`)
- Token decoding and validation
- Role extraction from JWT claims
- Token expiration checking

## HTTP Interceptors

### 1. Auth Interceptor (`core/interceptors/auth.interceptor.ts`)
- Automatically adds `Authorization: Bearer <token>` header
- Excludes login and refresh endpoints
- Runs before all HTTP requests

### 2. Refresh Token Interceptor (`core/interceptors/refresh-token.interceptor.ts`)
- Handles 401 Unauthorized responses
- Automatically refreshes access token using refresh token
- Retries failed request with new token
- Redirects to login if refresh fails

### 3. Error Interceptor (`core/interceptors/error.interceptor.ts`)
- Global error handling
- Shows user-friendly error messages via toast
- Handles different HTTP status codes
- Excludes 401 errors (handled by refresh interceptor)

## Guards

### Auth Guard (`core/guards/auth.guard.ts`)
- Protects routes requiring authentication
- Redirects to login if not authenticated
- Preserves return URL for redirect after login

### Role Guard (`core/guards/role.guard.ts`)
- Protects routes based on user roles
- Checks user role from JWT token
- Redirects to unauthorized page if role doesn't match
- Configurable via route data: `{ roles: ['Admin'] }`

## Feature Services

Each feature has its own service for API calls:
- `ProductsService` - Product management
- `OrdersService` - Order management
- `CustomersService` - Customer management
- `PaymentsService` - Payment processing

All services use the centralized `ApiService` for HTTP calls.

## Routing

### Main Routes (`app.routes.ts`)
```typescript
- /login - Public route
- /admin/* - Protected admin routes (lazy loaded)
- / - Redirects to /login
```

### Dashboard Routes (`features/dashboard/dashboard.routes.ts`)
```typescript
- /admin/dashboard - Admin dashboard
- /admin/orders - Orders list
- /admin/products - Products list
- /admin/payments - Payments list
- /admin/customers - Customers list
```

All routes use lazy loading and are protected by guards.

## Environment Configuration

### Development (`environments/environment.ts`)
```typescript
apiUrl: 'http://localhost:3000/api'
```

### Production (`environments/environment.prod.ts`)
```typescript
apiUrl: 'https://api.supermarket.com/api'
```

## Performance Optimizations

1. **OnPush Change Detection**
   - Reduces change detection cycles
   - Only checks when inputs change or events occur
   - Manual triggering with `markForCheck()` when needed

2. **TrackBy Functions**
   - Prevents unnecessary DOM updates
   - Uses unique identifiers for list items
   - Improves rendering performance

3. **Lazy Loading**
   - Code splitting by route
   - Smaller initial bundle
   - Faster time to interactive

4. **Standalone Components**
   - Better tree-shaking
   - Smaller bundle sizes
   - Faster compilation

## Type Safety

- ✅ Strict TypeScript configuration
- ✅ All interfaces exported and typed
- ✅ No `any` types
- ✅ Proper error handling with type guards

## Angular Material

- ✅ Added to `package.json` dependencies
- ✅ Ready for UI component integration
- ✅ Can be imported in components as needed

## Next Steps

1. Install Angular Material: `npm install`
2. Import Material modules in components as needed
3. Implement feature pages (products, orders, customers, payments)
4. Add loading states and error handling
5. Implement form validation
6. Add unit tests

## Backend Integration

The application is configured to work with:
- Base URL: `http://localhost:3000/api` (development)
- JWT authentication with refresh tokens
- Automatic token refresh on 401 errors
- Role-based route protection

## Best Practices Implemented

✅ Standalone components only
✅ Feature-based architecture
✅ Lazy-loaded routes
✅ OnPush change detection
✅ TrackBy functions
✅ Centralized API service
✅ HTTP interceptors
✅ Route guards
✅ Environment configuration
✅ Strict typing
✅ Error handling
✅ Token refresh flow

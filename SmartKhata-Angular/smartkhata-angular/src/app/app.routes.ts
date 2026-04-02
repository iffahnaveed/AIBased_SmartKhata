// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guards';

export const routes: Routes = [
  // Auth pages (no guard)
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup.component').then(m => m.SignupComponent)
  },

  // ❌ REMOVE the broken /dashboard route that loaded AppComponent
  // AppComponent IS the shell — it renders via index.html, not a route

  // App pages (all guarded)
  {
    path: 'dashboard',           // ✅ dashboard now loads StockComponent
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/stock.component').then(m => m.StockComponent)
  },
  {
    path: 'stock',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/stock.component').then(m => m.StockComponent)
  },
  {
    path: 'sales',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/sale.component').then(m => m.SalesComponent)
  },
  {
    path: 'statistics',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/statistics.component').then(m => m.StatisticsComponent)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/settings.component').then(m => m.SettingsComponent)
  },

  // Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // ✅ start at login
  { path: '**', redirectTo: 'login' }
];
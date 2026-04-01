// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guards';

export const routes: Routes = [

  // ── Auth pages ─────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login.component').then(m => m.LoginComponent)
  },

  // ── App pages ──────────────────────────────────────────────
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

  // ── Default redirect ───────────────────────────────────────
  { path: '', redirectTo: 'stock', pathMatch: 'full' },
  { path: '**', redirectTo: 'stock' }

];
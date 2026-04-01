// src/app/components/topbar/topbar.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

const PAGE_TITLES: Record<string, string> = {
  stock:      'Stock',
  sales:      'Record Sale',
  statistics: 'Statistics',
  settings:   'Settings',
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <div class="topbar-title">{{ pageTitle() }}</div>
      <span class="topbar-date">{{ today }}</span>
    </header>
  `
})
export class TopbarComponent {
  private router = inject(Router);
  currentRoute = signal('stock');
  pageTitle    = signal('Stock');

  today = new Date().toLocaleDateString('en-PK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const seg = e.urlAfterRedirects.replace('/', '').split('/')[0] || 'stock';
      this.currentRoute.set(seg);
      this.pageTitle.set(PAGE_TITLES[seg] ?? 'SmartKhata');
    });
  }
}
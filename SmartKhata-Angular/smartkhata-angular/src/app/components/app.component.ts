import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from '../shared/topbar.component';
import { ToastComponent } from '../shared/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastComponent],
  template: `
    @if (isAuthPage()) {
      <router-outlet />
    } @else {
      <div class="app-shell">
        <app-sidebar />
        <div class="main-content">
          <app-topbar />
          <main class="page-content">
            <router-outlet />
          </main>
        </div>
      </div>
      <app-toast />
    }
  `
})
export class AppComponent {
  constructor(public router: Router) {}

  isAuthPage(): boolean {
    const url = this.router.url;
    return url === '/login' || url === '/signup' || url === '/';
  }
}
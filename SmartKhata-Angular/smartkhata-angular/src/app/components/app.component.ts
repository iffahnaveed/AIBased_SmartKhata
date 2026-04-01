// // src/app/app.component.ts
// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { SidebarComponent } from './components/sidebar/sidebar.component';
// import { TopbarComponent } from './components/topbar/topbar.component';
// import { ToastComponent } from './components/modals/toast.component';
// import { provideHttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastComponent],
//   template: `
//     <div class="app-shell">
//       <app-sidebar />
//       <div class="main-content">
//         <app-topbar />
//         <main class="page-content">
//           <router-outlet />
//         </main>
//       </div>
//     </div>
//     <app-toast />
//   `
// })
// export class AppComponent {}
// src/app/app.component.ts


// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { SidebarComponent } from './sidebar.component';
// import { TopbarComponent } from '../shared/topbar.component';
// import { ToastComponent } from '../shared/toast.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastComponent],
//   template: `
//     <div class="app-shell">
//       <app-sidebar />
//       <div class="main-content">
//         <app-topbar />
//         <main class="page-content">
//           <router-outlet />
//         </main>
//       </div>
//     </div>
//     <app-toast />
//   `
// })
// export class AppComponent {}

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
    @if (router.url === '/login') {

      <!-- LOGIN PAGE -->
      <router-outlet />

    } @else {

      <!-- APP LAYOUT -->
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

}
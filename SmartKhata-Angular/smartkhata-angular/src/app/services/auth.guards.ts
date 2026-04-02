// src/app/services/auth.guards.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = sessionStorage.getItem('sk_logged_in') === '1';

  if (isLoggedIn) {
    return true;
  }

  // Not logged in → redirect to login
  return router.createUrlTree(['/login']);
};
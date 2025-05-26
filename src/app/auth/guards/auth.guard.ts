import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getLoggedUser();

  if (!user){
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data['role'];

  if (requiredRole && user.userRole !== requiredRole){
    router.navigate(['/login']);
    return false;
  }

  return true;
};

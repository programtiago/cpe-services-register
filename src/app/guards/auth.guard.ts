import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../components/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()){
    return true;
  }else{
    console.log('AuthGuard triggered, logged in:', authService.isLoggedIn());
    router.navigate([''])
    return false;
  }
};

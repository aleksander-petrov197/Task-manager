import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token && token !== 'undefined') {
    return true; 
  } else {
    router.navigate(['/login']); 
    return false;
  }
};
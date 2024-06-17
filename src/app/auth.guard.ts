import { CanActivateFn, Router } from '@angular/router';
import { ServicioDBService } from './services/servicio-db.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn =  async  (route, state) => {
    const servicioDBService = inject(ServicioDBService); 
    const router = inject(Router);

    const isAuthenticated = await servicioDBService.haveaccess();
    if (!isAuthenticated) {
      alert('Acceso denegado');
      await router.navigate(['/login']);
      return false;
    }
    return true;
  };

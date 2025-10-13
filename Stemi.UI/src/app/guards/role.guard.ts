import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as UserRole[];

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const hasRequiredRole = expectedRoles.some(role =>
      this.authService.hasRole(role)
    );

    if (!hasRequiredRole) {
      // Перенаправляем на страницу согласно роли
      if (this.authService.isStudent()) {
        this.router.navigate(['/dashboard']);
      } else if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/access-denied']);
      }
      return false;
    }

    return true;
  }
}

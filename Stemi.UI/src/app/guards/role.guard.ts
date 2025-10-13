import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: any): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;

    if (this.authService.isAuthenticated()) {
      const hasRole = expectedRoles.some(role => this.authService.hasRole(role));

      if (hasRole) {
        return true;
      } else {
        this.router.navigate(['/access-denied']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

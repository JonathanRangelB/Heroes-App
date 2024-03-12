import { Injectable, inject } from '@angular/core';
import { CanActivate, CanMatch, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch, CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) this.router.navigate(['/auth/login']);
      })
    );
  }

  canMatch(): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }
  canActivate(): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }
}

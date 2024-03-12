import { Injectable, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivateFn, Router, CanMatchFn } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PublicGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate: CanActivateFn = (): Observable<boolean> => {
    return this.checkAuthStatus();
  };

  canMatch: CanMatchFn = (): Observable<boolean> => {
    return this.checkAuthStatus();
  };

  private checkAuthStatus(): Observable<boolean> {
    return this.authService.checkAuthentication().pipe(
      tap((isAuthenticated) => {
        if (isAuthenticated) this.router.navigate(['/heroes']);
      }),
      map((isAuthenticated) => !isAuthenticated)
    );
  }
}

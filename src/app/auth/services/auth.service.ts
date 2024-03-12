import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.baseUrl;
  private user?: User;
  private _router = inject(Router);
  private http = inject(HttpClient);
  private _snackbar = inject(MatSnackBar);

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => (this.user = user)),
      tap((user) => localStorage.setItem('token', 'kjas89df4.29riksdn.8asduf'))
    );
  }

  logout(): void {
    this.user = undefined;
    localStorage.clear();
    this._snackbar.open('Sesión cerrada', 'Cerrar', {
      duration: 3000,
    });
    this._router.navigate(['/auth/login']);
  }

  checkAuthentication(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);
    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => (this.user = user)),
      map((user) => !!user),
      catchError(() => of(false))
    );
  }
}

import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``,
})
export class LoginPageComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  onLogin() {
    this._authService.login('email', 'password').subscribe((user) => {
      this._router.navigate(['/']);
    });
  }
}

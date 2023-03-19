import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/shared/services/socket.service';
import { AuthService } from '../../services/auth.service';
import { LoginRequestInterface } from '../../types/loginRequest.interface';
import { registerRequestInterface } from '../../types/registerRequest.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketService
  ) {}

  errorMessage: string | null = null;

  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    this.authService.login(this.form.value as LoginRequestInterface).subscribe({
      next: (currentUser) => {
        console.log(currentUser);
        this.authService.setToken(currentUser);
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.errorMessage = null;
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse): void => {
        console.log('error', err.error);
        this.errorMessage = err.error.emailOrPassword;
      },
    });
  }
}

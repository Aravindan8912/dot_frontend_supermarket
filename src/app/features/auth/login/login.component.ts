import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.authService.setTokens(response.accessToken, response.refreshToken);
          this.cdr.markForCheck();
          
          // Get user role from token
          const userRole = this.authService.getUserRole();
          
          // Show success message based on role
          if (userRole === 'Admin') {
            this.toastService.success('Login successful! Welcome to Admin Dashboard.');
          } else {
            this.toastService.success('Login successful! Welcome back.');
          }
          
          // Navigate based on role
          setTimeout(() => {
            if (userRole === 'Admin') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/dashboard']).catch(() => {
                // If dashboard route doesn't exist, redirect to home
                this.router.navigate(['/']);
              });
            }
          }, 500);
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.cdr.markForCheck();
          const httpError = error as { error?: { message?: string }; message?: string };
          const errorMessage = httpError?.error?.message || httpError?.message || 'Invalid email or password. Please try again.';
          this.toastService.error(errorMessage);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

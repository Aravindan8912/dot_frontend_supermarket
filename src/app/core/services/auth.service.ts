import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshTokenRequest } from '../../shared/models/auth.models';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private jwtService = inject(JwtService);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/auth/login', credentials);
  }

  refreshToken(refreshToken: string): Observable<LoginResponse> {
    const request: RefreshTokenRequest = { refreshToken };
    return this.apiService.post<LoginResponse>('/auth/refresh', request);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    return !this.jwtService.isTokenExpired(token);
  }

  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return this.jwtService.getRole(token);
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isUser(): boolean {
    return this.getUserRole() === 'User';
  }

  getUserEmail(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return this.jwtService.getEmail(token);
  }
}

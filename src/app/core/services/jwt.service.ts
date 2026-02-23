import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getRole(token: string): string | null {
    const decoded = this.decodeToken(token);
    if (decoded && decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
    // Fallback: check for 'role' claim
    if (decoded && decoded.role) {
      return decoded.role;
    }
    return null;
  }

  getEmail(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.email || decoded?.Email || null;
  }

  getUserId(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.sub || decoded?.nameid || null;
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }
}

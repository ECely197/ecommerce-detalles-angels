import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // URL de tu API

  constructor(private http: HttpClient) {}

  setToken(token: string): void {
    localStorage.setItem('user_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('user_token');
    localStorage.removeItem('userId'); // Limpiar el ID del usuario al cerrar sesión
    localStorage.removeItem('userAvatar'); // Limpiar la imagen del usuario al cerrar sesión
  }

  getToken(): string | null {
    return localStorage.getItem('user_token');
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUserAvatar(): string | null {
    return localStorage.getItem('userAvatar');
  }

  // Método de inicio de sesión
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { headers }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token); // Almacena el token
          localStorage.setItem('userId', response.user._id); // Almacena el ID del usuario
          localStorage.setItem('userAvatar', response.user.avatar); // Almacena la imagen del usuario
        }
      })
    );
  }
}

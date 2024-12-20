import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User, RegisterData, LoginResponse, RegisterResponse } from '../models/user.model'; 
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  register(registerData: FormData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, registerData).pipe(
      tap((response: RegisterResponse) => {
        if (response?.user?._id && response.token) {
          localStorage.setItem('userId', response.user._id);
          this.authService.setToken(response.token);
        }
      }),
      catchError(this.handleError<RegisterResponse>('Error al registrar el usuario'))
    );
  }

  uploadAvatar(userId: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/avatar/${userId}`, formData).pipe(
      catchError(this.handleError('Error al subir el avatar'))
    );
  };
  login(credentials: { }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials,{}).pipe(
      tap((response: LoginResponse) => {
        if (response?.token) {
          this.authService.setToken(response.token);
        }
      }),
      catchError(this.handleError<LoginResponse>('Error al iniciar sesión'))
  );
  }

  fetchUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/api/user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).pipe(
        catchError(err => {
            console.error('Error al obtener el perfil del usuario', err);
            return throwError(err);
        })
    );
}



  isLogged(): boolean {
    return this.authService.isLogged();
  }

  private handleError<T>(defaultMessage: string) {
    return (error: HttpErrorResponse): Observable<T> => {
      let errorMessage = defaultMessage;
      // Manejo de diferentes formatos de error
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else if (error.error?.message) {
      // Error del servidor con mensaje específico
      errorMessage = error.error.message;
    } else if (error.message) {
      // Otro formato de error
      errorMessage = error.message;
    }

    // Log detallado del error
    console.error(`Error: ${defaultMessage}`, error);

    // Retornar un observable que lanza el error con un mensaje amigable
    return throwError(() => new Error(errorMessage));
      // const errorMessage = error.error?.message || defaultMessage;
      // console.error(defaultMessage, error);
      // return throwError(() => new Error(errorMessage));
    };
  }
}
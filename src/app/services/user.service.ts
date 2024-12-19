import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User, RegisterData, LoginResponse, RegisterResponse } from '../models/user.model'; 
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

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
  }
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
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
    return (error: any): Observable<T> => {
      const errorMessage = error.error?.message || defaultMessage;
      console.error(defaultMessage, error);
      return throwError(() => new Error(errorMessage));
    };
  }
}
// import { HttpClient } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { User } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private http = inject(HttpClient)

//   constructor() { }

//   register(formData: any) {
//     return this.http.post("http://localhost:3000/api/auth/register",
//       formData
//     )
//   }

//   login(formData: any) {
//     return this.http.post("http://localhost:3000/api/auth/login", {
//       email: formData.email,
//       password: formData.password,
//     })
//   }

//   isLogged() {
//     if (localStorage.getItem("user_token")) {
//       return true
//     } else {
//       return false
//     }
//   }

// }

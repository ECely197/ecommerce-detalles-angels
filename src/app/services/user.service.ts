import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient)

  constructor() { }

  register(formData: any) {
    return this.http.post("http://localhost:3000/api/auth/register",
      formData
    )
  }

  login(formData: any) {
    return this.http.post("http://localhost:3000/api/auth/login", {
      email: formData.email,
      password: formData.password,
    })
  }

  isLogged() {
    if (localStorage.getItem("user_token")) {
      return true
    } else {
      return false
    }
  }

}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../models/user.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router)
  private userService = inject(UserService)
  private authService = inject(AuthService)

  loginForm = new FormGroup({
    email: new FormControl("", {
      validators: [Validators.required]
    }),
    password: new FormControl("", {
      validators: [Validators.required]
    })
  })

  onSubmit() {
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    if (this.loginForm.valid) {
      this.userService.login(credentials).subscribe({
        next: (response: any) => {
          this.authService.setToken(response.token)
          this.router.navigate(["/ruta-privada"])
        },
        error: error => {
          console.log(error)
        }
      })
    } else {
      console.log("Campos no validos")
    }
  }
}

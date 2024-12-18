import { Component, inject, signal, Input } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CartProductComponent } from '../cart-product/cart-product.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLinkWithHref,
    CommonModule,
    CurrencyPipe,
    CartProductComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  cart = this.cartService.products;

  handleCartClick(): void {
    this.cartService.toggleCartVisibility();
  }

  isLogged() {
    return this.userService.isLogged();
  }

  logout() {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}

import { Component, Input, inject, Signal, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartProductComponent } from '../cart-product/cart-product.component';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    CartProductComponent,
    CommonModule,
    RouterLinkWithHref,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private cartService = inject(CartService);

  cart = this.cartService.products;
  totalPrice = this.cartService.total;
  cartVisibility = this.cartService.cartVisibility;

  handleCartClick(): void {
    this.cartService.toggleCartVisibility();
  }
}

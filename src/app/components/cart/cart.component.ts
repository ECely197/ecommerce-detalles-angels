import { Component, inject, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartProductComponent } from '../cart-product/cart-product.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    CartProductComponent,
    CommonModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  private cartService = inject(CartService);

  cart = this.cartService.products;
  cartVisibility = this.cartService.cartVisibility;

  cartProducts = computed(() => Array.from(this.cart().values()));

  totalQuantity = computed(() => {
    return this.cartProducts().reduce((acc, product) => acc + product.quantity, 0);
  });

  totalPrice = computed(() => {
    return this.cartProducts().reduce((acc, product) => acc + (product.precio * product.quantity), 0);
  });

  handleCartClick(): void {
    this.cartService.toggleCartVisibility();
  }
}

import { Component, Input, inject, Signal, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartProductComponent } from '../cart-product/cart-product.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    CartProductComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private cartService = inject(CartService);

  cart = this.cartService.products;
  cartVisibility = this.cartService.cartVisibility;

  // Convertimos los valores del Map en un array de productos.
  cartProducts = computed(() => Array.from(this.cart().values()));

  // Computamos la cantidad total de items sumando las cantidades de cada producto
  totalQuantity = computed(() => {
    return this.cartProducts().reduce((acc, product) => acc + product.quantity, 0);
  });

  // Computamos el precio total multiplicando precio * cantidad de cada producto y sumando todos
  totalPrice = computed(() => {
    return this.cartProducts().reduce((acc, product) => acc + (product.precio * product.quantity), 0);
  });

  handleCartClick(): void {
    this.cartService.toggleCartVisibility();
  }
}

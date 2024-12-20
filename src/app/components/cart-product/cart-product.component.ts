import { CurrencyPipe } from '@angular/common';
import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Producto } from '../../models/product.model';

@Component({
  selector: 'cart-product',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.css']
})
export class CartProductComponent {
  private cartService = inject(CartService)
  @Input() product: any;

  productQuantity = new FormControl(0);

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      // Asignamos la cantidad proveniente del producto en el carrito
      this.productQuantity.setValue(this.product.quantity);
    }
  }

  increment(productId: string) {
    this.cartService.incrementQuantity(productId)
  }

  decrement(productId: string) {
    this.cartService.decrementQuantity(productId)
  }

  delete(productId: string) {
    this.cartService.deleteProduct(productId)
  }
}

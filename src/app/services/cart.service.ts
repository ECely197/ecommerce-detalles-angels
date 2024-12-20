import { computed, Injectable, inject, signal } from '@angular/core';
import { Producto } from '../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  products = signal(new Map<string, Producto & { quantity: number }>());
  cartVisibility = signal(false);

  total = computed(() => {
    const productsMap = this.products();
    let total = 0;

    productsMap.forEach((product) => {
      total += product.precio * product.quantity;
    });

    return total;
  });

  toggleCartVisibility() {
    this.cartVisibility.update((value) => !value);
  }

  addToCart(product: Producto) {
    const productId = product._id ?? ''; // Asegúrate de que _id tiene un valor predeterminado
    this.products.update((productsMap) => {
      const productInCart = productsMap.get(productId);
      if (productInCart) {
        productsMap.set(productId, {
          ...productInCart,
          quantity: productInCart.quantity + 1,
        });
      } else {
        productsMap.set(productId, { ...product, quantity: 1 });
      }

      return new Map(productsMap);
    });
  }

  incrementQuantity(productId: string) {
    this.products.update((productsMap) => {
      const productInCart = productsMap.get(productId);
      if (productInCart) {
        productsMap.set(productId, {
          ...productInCart,
          quantity: productInCart.quantity + 1,
        });
      }
      return new Map(productsMap);
    });
  }

  decrementQuantity(productId: string) {
    this.products.update((productsMap) => {
      const productInCart = productsMap.get(productId);
      if (productInCart!.quantity === 1) {
        productsMap.delete(productId);
      } else {
        productsMap.set(productId, {
          ...productInCart!,
          quantity: productInCart!.quantity - 1,
        });
      }
      return new Map(productsMap);
    });
  }

  deleteProduct(productId: string) {
    this.products.update((productsMap) => {
      productsMap.delete(productId);
      return new Map(productsMap);
    });
  }

  createOrder(formData: any) {
    const mapToArray = Array.from(this.products().values());
    const productsArray = mapToArray.map((product) => {
      return { productId: product._id ?? '', quantity: product.quantity }; // Asegúrate de que _id tiene un valor predeterminado
    });

    return this.http.post(
      'http://localhost:3000/api/orders',
      {
        products: productsArray,
        total: this.total(),
        dato1: formData.dato1,
        dato2: formData.dato2,
        dato3: formData.dato3,
        paymentMethod: formData.paymentMethod,
      },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}

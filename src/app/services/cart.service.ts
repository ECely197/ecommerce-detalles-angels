import { computed, Injectable, inject, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { CartProduct } from '../models/cart-product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor() {}

  private http = inject(HttpClient);
  products = signal(new Map());
  cartVisibility = signal(false);

  total = computed(() => {
    const productsMap = this.products();
    let total = 0;

    productsMap.forEach((product) => {
      total += product.price * product.quantity;
    });

    return total;
  });

  toggleCartVisibility() {
    this.cartVisibility.update((value) => !value);
  }

  addToCart(product: Product) {
    this.products.update((productsMap) => {
      const productInCart = productsMap.get(product._id);
      if (productInCart) {
        productsMap.set(product._id, {
          ...productInCart,
          quantity: productInCart.quantity + 1,
        });
      } else {
        productsMap.set(product._id, { ...product, quantity: 1 });
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
    console.log('Create order');
    console.log(formData);
    console.log(this.products().values());

    const mapToArray = Array.from(this.products().values());
    const productsArray = mapToArray.map((product) => {
      return { productId: product._id, quantity: product.quantity };
    });

    console.log(productsArray);

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
          Authorization: `Bearer ${localStorage.getItem('user_token')}`, // Reemplaza 'tu_token_aqui' con el token real
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}

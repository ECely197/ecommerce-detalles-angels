import { computed, inject, Injectable, signal } from '@angular/core';
import { Producto } from '../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor() {}
  private cartItems: { product: Producto; quantity: number }[] = [];
  productos = signal(new Map());
  cartVisibility = signal(false);
  private http = inject(HttpClient)

  //visualizacion de carrito (codigo copiado)
  total = computed(() => {
    const productsMap = this.productos();
    let total = 0;

    productsMap.forEach((product) => {
      total += product.price * product.quantity;
    });

    return total;
  });
  //****************************
  
  toggleCartVisibility() {
    this.cartVisibility.update((value) => !value);
  }

  // addToCart(product: Producto, quantity: number): void {
  //   const existingItem = this.cartItems.find(item => item.product._id === product._id);
  //   if (existingItem) {
  //     existingItem.quantity += quantity;
  //   } else {
  //     this.cartItems.push({ product, quantity });
  //   }
  //   console.log('Product added to cart:', this.cartItems);
  // }
  addToCart(product: Producto) {
    this.productos.update((productosMap) => {
      const productInCart = productosMap.get(product._id);
      if (productInCart) {
        productosMap.set(product._id, {
          ...productInCart,
          quantity: productInCart.quantity + 1,
        });
      } else {
        productosMap.set(product._id, { ...product, quantity: 1 });
      }

      return new Map(productosMap);
    });
  }

  getCartItems() {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
  }
  incrementQuantity(productId: string) {
    this.productos.update((productosMap) => {
      const productInCart = productosMap.get(productId);

      if (productInCart) {
        productosMap.set(productId, {
          ...productInCart,
          quantity: productInCart.quantity + 1,
        });
      }

      return new Map(productosMap);
    });
  }

  decrementQuantity(productId: string) {
    this.productos.update((productosMap) => {
      const productInCart = productosMap.get(productId);
      if (productInCart!.quantity === 1) {
        productosMap.delete(productId);
      } else {
        productosMap.set(productId, {
          ...productInCart!,
          quantity: productInCart!.quantity - 1,
        });
      }

      return new Map(productosMap);
    });
  }

  deleteProduct(productId: string) {
    this.productos.update((productosMap) => {
      productosMap.delete(productId);
      return new Map(productosMap);
    });
  }
  createOrder(formData: any) {
    console.log('Create order');
    console.log(formData);
    console.log(this.productos().values());

    const mapToArray = Array.from(this.productos().values());
    const productosArray = mapToArray.map((producto) => {
      return { productId: producto._id, quantity: producto.quantity };
    });

    console.log(productosArray);

    return this.http.post(
      'http://localhost:3000/api/orders',
      {
        products: productosArray,
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

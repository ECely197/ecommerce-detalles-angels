import { computed, Injectable, signal } from '@angular/core';
import { Producto } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: { product: Producto; quantity: number }[] = [];
  productos = signal(new Map());
  cartVisibility = signal(false);

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

  addToCart(product: Producto, quantity: number): void {
    const existingItem = this.cartItems.find(item => item.product._id === product._id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    console.log('Product added to cart:', this.cartItems);
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
}

//   createOrder(formData: any) {
//     console.log('Create order');
//     console.log(formData);
//     console.log(this.products().values());

//     const mapToArray = Array.from(this.products().values());
//     const productsArray = mapToArray.map((product) => {
//       return { productId: product._id, quantity: product.quantity };
//     });

//     console.log(productsArray);

//     return this.http.post(
//       'http://localhost:3000/api/orders',
//       {
//         products: productsArray,
//         total: this.total(),
//         dato1: formData.dato1,
//         dato2: formData.dato2,
//         dato3: formData.dato3,
//         paymentMethod: formData.paymentMethod,
//       },
//       {
//         headers: new HttpHeaders({
//           Authorization: `Bearer ${localStorage.getItem('user_token')}`, // Reemplaza 'tu_token_aqui' con el token real
//           'Content-Type': 'application/json',
//         }),
//       }
//     );
//   }
// }

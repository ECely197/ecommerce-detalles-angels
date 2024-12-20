import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { Producto } from '../../models/product.model';
import { ProductoService } from '../../services/product.service';
import { RouterLinkWithHref } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ProductoDestacadoComponent } from '../../components/producto-destacado/producto-destacado.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterLinkWithHref,
    CurrencyPipe,
    ProductoDestacadoComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private productService = inject(ProductoService);
  private cartService = inject(CartService);

  products = signal<Producto[]>([]);

  ngOnInit() {
    this.productService.list()
      .subscribe({
        next: (response: any) => {
          this.products.set(response);
        },
        error: error => {
          console.log(error);
        }
      });
  }

  addToCart(product: Producto) {
    this.cartService.addToCart(product);
  }

  removeFromCart() {}

  trackByProductId(index: number, product: Producto): string {
    return product._id ?? 'default-id';
  }
}

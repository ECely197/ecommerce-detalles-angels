import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { RouterLinkWithHref } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterLinkWithHref, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private productService = inject(ProductService)
  private cartService = inject(CartService)

  products = signal<Product[]>([])

  ngOnInit() {
    this.productService.list()
      .subscribe({
        next: (response: any) => {
          this.products.set(response)
        },
        error: error => {
          console.log(error)
        }
      })
  }

  addToCart(product: any) {
    this.cartService.addToCart(product)
  }

  removeFromCart() {

  }
}

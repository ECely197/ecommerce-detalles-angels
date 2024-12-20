import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductosSimilaresComponent } from "./components/productos-similares/productos-similares.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CartComponent, ProductosSimilaresComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showCart = signal(false);

  toggleShowCart() {
    this.showCart.update((prevState) => !prevState);
  }

  toggleCart() {
    console.log('---');
  }
}

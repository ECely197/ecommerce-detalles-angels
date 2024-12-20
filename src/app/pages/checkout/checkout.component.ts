import { Component, inject } from '@angular/core';
import { CartProductComponent } from '../../components/cart-product/cart-product.component';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CartProductComponent, HeaderComponent, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private cartService = inject(CartService)
  private router = inject(Router)

  products = this.cartService.products

  paymentDetails = new FormGroup({
    dato1: new FormControl(""),
    dato2: new FormControl(""),
    dato3: new FormControl(""),
    paymentMethod: new FormControl("")
  })

  onSubmit() {
    if(this.products().size >= 1 && this.paymentDetails.valid) {
      this.cartService.createOrder(this.paymentDetails.value)
      .subscribe({
        next: () => this.router.navigate(["/thanks"])
      })
    }
  }
}
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CartProductComponent } from '../../components/cart-product/cart-product.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, CartProductComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private router = inject(Router);

  cart = this.cartService.products;
  totalPrice = this.cartService.total;

  paymentForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    paymentMethod: new FormControl('credit-card', [Validators.required]),
  });

  onSubmit() {
    if (this.paymentForm.valid && this.cart().size > 0) {
      this.cartService.createOrder(this.paymentForm.value).subscribe({
        next: () => {
          alert('Order placed successfully!');
          this.router.navigate(['/thanks']);
        },
        error: (err) => {
          console.error('Order submission failed:', err);
          alert('Failed to place order. Please try again.');
        },
      });
    } else {
      alert('Please fill in all fields and ensure your cart is not empty.');
    }
  }
}

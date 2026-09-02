import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';
import { CouponService } from '../../services/coupon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  
})
export class Checkout {
  customerName: string = '';
  phone: string = '';
  address: string = '';
  couponCode: string = '';
  discount: number = 0;
  couponMessage: string = '';
  isSubmitting: boolean = false;
  imageBaseUrl = environment.apiBaseUrl;

  selectedCity: string = '';
  freeDeliveryThreshold: number = 100;

  cities = [
    { name: 'Tunis', fee: 7 },
    { name: 'Sfax', fee: 9 },
    { name: 'Sousse', fee: 8 },
    { name: 'Kasserine', fee: 10 },
    { name: 'Jendouba', fee: 10 }
  ];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private couponService: CouponService,
    private router: Router
  ) {}

  getSubtotal(): number {
    return this.cartService.getTotal();
  }

  getCartItems() {
    return this.cartService.getItems();
  }

  getDeliveryFee(): number {
    if (!this.selectedCity) return 0;
    if (this.getSubtotal() - this.discount >= this.freeDeliveryThreshold) return 0;
    const city = this.cities.find(c => c.name === this.selectedCity);
    return city ? city.fee : 0;
  }

  getFinalTotal(): number {
    return this.getSubtotal() - this.discount + this.getDeliveryFee();
  }

  applyCoupon(): void {
    const subtotal = this.getSubtotal();
    this.couponService.validateCoupon(this.couponCode, subtotal).subscribe({
      next: (response) => {
        this.discount = response.discount;
        this.couponMessage = `Coupon applied! -${this.discount} DT`;
      },
      error: (err) => {
        this.discount = 0;
        this.couponMessage = err.error.message || 'Invalid coupon';
      }
    });
  }

  submitOrder(): void {
    this.isSubmitting = true;
    const items = this.cartService.getItems();
const order = {
  customerName: this.customerName,
  phone: this.phone,
  address: this.address,
  city: this.selectedCity,
  couponCode: this.couponCode || null,
  products: items,
  total: this.getFinalTotal()
};

    this.orderService.createOrder(order).subscribe({
      next: () => {
        alert('Commande envoyée avec succès !');
        this.cartService.clearCart();
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error submitting order:', err);
        alert('Une erreur est survenue. Veuillez réessayer.');
        this.isSubmitting = false;
      }
    });
  }
}
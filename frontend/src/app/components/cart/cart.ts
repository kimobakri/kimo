import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  items: CartItem[] = [];
  total: number = 0;
  imageBaseUrl = environment.apiBaseUrl;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.loadCart();
  }

  increaseQuantity(item: CartItem): void {
    const success = this.cartService.updateQuantity(item.product._id, item.quantity + 1);
    if (!success) {
      alert('Stock maximum atteint pour ce produit.');
    }
    this.loadCart();
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product._id, item.quantity - 1);
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }
}
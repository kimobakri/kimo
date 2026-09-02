import { Injectable } from '@angular/core';
import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];

  getItems(): CartItem[] {
    return this.items;
  }

addToCart(product: Product, quantity: number = 1): boolean {
  const existingItem = this.items.find(item => item.product._id === product._id);
  const currentQuantity = existingItem ? existingItem.quantity : 0;

  if (currentQuantity + quantity > product.stock) {
    return false;
  }

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ product, quantity });
  }

  return true;
}

  removeFromCart(productId: string): void {
    this.items = this.items.filter(item => item.product._id !== productId);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  clearCart(): void {
    this.items = [];
  }
  updateQuantity(productId: string, quantity: number): boolean {
  const item = this.items.find(i => i.product._id === productId);
  if (!item) return false;

  if (quantity <= 0) {
    this.removeFromCart(productId);
    return true;
  }

  if (quantity > item.product.stock) {
    return false;
  }

  item.quantity = quantity;
  return true;
}
}
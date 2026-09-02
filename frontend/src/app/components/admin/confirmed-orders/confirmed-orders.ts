import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../../services/order';

@Component({
  selector: 'app-confirmed-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmed-orders.html',
  styleUrl: './confirmed-orders.css'
})
export class ConfirmedOrders implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadConfirmedOrders();
  }

  loadConfirmedOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data.filter(order => order.status === 'confirmed');
      },
      error: (err) => console.error(err)
    });
  }

  removeFromList(orderId: string): void {
  this.orderService.deleteOrder(orderId).subscribe({
    next: () => {
      this.orders = this.orders.filter(order => order._id !== orderId);
    },
    error: (err) => console.error(err)
  });
}
}
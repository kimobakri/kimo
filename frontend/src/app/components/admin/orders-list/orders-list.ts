import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../../services/order';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css'
})
export class OrdersList implements OnInit {
  orders: Order[] = [];
  statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

loadOrders(): void {
  this.orderService.getOrders().subscribe({
    next: (data) => {
      this.orders = data.filter(order => order.status !== 'confirmed');
    },
    error: (err) => console.error(err)
  });
}

 confirmOrder(order: Order): void {
  this.orderService.updateOrderStatus(order._id, 'confirmed').subscribe({
    next: () => { this.loadOrders(); },
    error: (err) => console.error(err)
  });
}
}
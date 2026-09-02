import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

export interface OrderData {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  couponCode?: string | null;
  products: any[];
}

export interface Order extends OrderData {
total: any;
  _id: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(order: OrderData): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, { status });
  }
  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
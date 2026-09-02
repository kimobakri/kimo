import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../services/product';
import { DashboardService, DashboardStats } from '../../../services/dashboard';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  imageBaseUrl = environment.apiBaseUrl;
  products: Product[] = [];
  stats: DashboardStats | null = null;
  isLoadingProducts: boolean = true;

  constructor(
    private productService: ProductService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadStats();
  }

  loadProducts(): void {
    this.isLoadingProducts = true;
    this.productService.getProducts().subscribe({
      next: (data) => { this.products = data; this.isLoadingProducts = false; },
      error: (err) => { console.error(err); this.isLoadingProducts = false; }
    });
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => { this.stats = data; },
      error: (err) => console.error(err)
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => { this.loadProducts(); },
        error: (err) => console.error(err)
      });
    }
  }
}
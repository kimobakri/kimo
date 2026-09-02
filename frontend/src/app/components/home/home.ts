import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  popularProducts: Product[] = [];
  imageBaseUrl = environment.apiBaseUrl;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts({}).subscribe({
      next: (data) => {
        this.popularProducts = data.slice(0, 4);
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  addToCart(product: Product): void {
    const success = this.cartService.addToCart(product);
    if (success) {
      alert('Produit ajouté au panier !');
    } else {
      alert('Stock maximum atteint.');
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  quantity: number = 1;
  imageBaseUrl = environment.apiBaseUrl;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Produit introuvable.';
      this.isLoading = false;
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.errorMessage = 'Impossible de charger ce produit pour le moment.';
        this.isLoading = false;
      }
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    const success = this.cartService.addToCart(this.product, this.quantity);
    if (success) {
      alert('Produit ajouté au panier !');
      this.quantity = 1;
    } else {
      alert('Stock maximum atteint pour ce produit.');
    }
  }
}
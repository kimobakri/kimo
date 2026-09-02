import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit, OnDestroy {
  imageBaseUrl = environment.apiBaseUrl;

  allProducts: Product[] = [];
  products: Product[] = [];
  displayedProducts: Product[] = [];

  pageSize = 8;
  private currentLimit = this.pageSize;

  searchTerm: string = '';
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  inStockOnly: boolean = false;
  sortOption: string = '';

  categories: string[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';

  private searchChanged = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const categoryFromUrl = this.route.snapshot.queryParamMap.get('category');
    if (categoryFromUrl) {
      this.selectedCategory = categoryFromUrl;
    }

    this.searchChanged.pipe(debounceTime(400)).subscribe(() => {
      this.loadProducts();
    });

    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.searchChanged.unsubscribe();
  }

  loadCategories(): void {
    this.productService.getProducts({}).subscribe({
      next: (data) => this.extractCategories(data),
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts({
      search: this.searchTerm
    }).subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFiltersAndSort();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.errorMessage = 'Impossible de charger les produits pour le moment. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  applyFiltersAndSort(): void {
    let result = [...this.allProducts];

    if (this.selectedCategory) {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    if (this.minPrice !== null) {
      result = result.filter(p => p.price >= this.minPrice!);
    }

    if (this.maxPrice !== null) {
      result = result.filter(p => p.price <= this.maxPrice!);
    }

    if (this.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    switch (this.sortOption) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
        break;
    }

    this.products = result;
    this.currentLimit = this.pageSize;
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts(): void {
    this.displayedProducts = this.products.slice(0, this.currentLimit);
  }

  loadMore(): void {
    this.currentLimit += this.pageSize;
    this.updateDisplayedProducts();
  }

  extractCategories(data: Product[]): void {
    const unique = new Set(data.map(p => p.category));
    this.categories = Array.from(unique);
  }

  onSearchChange(): void {
    this.searchChanged.next();
  }

  onFilterChange(): void {
    this.applyFiltersAndSort();
  }
get hasActiveFilters(): boolean {
  return !!(this.searchTerm || this.selectedCategory || this.minPrice !== null ||
    this.maxPrice !== null || this.inStockOnly || this.sortOption);
}

clearFilters(): void {
  this.searchTerm = '';
  this.selectedCategory = '';
  this.minPrice = null;
  this.maxPrice = null;
  this.inStockOnly = false;
  this.sortOption = '';
  this.loadProducts();
}
  addToCart(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const success = this.cartService.addToCart(product);
    if (success) {
      alert('Produit ajouté au panier !');
    } else {
      alert('Stock maximum atteint.');
    }
  }
}
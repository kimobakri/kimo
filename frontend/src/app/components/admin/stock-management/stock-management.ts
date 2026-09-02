import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../services/product';
import { environment } from '../../../../environments/environment';

interface StockRow extends Product {
  editedStock: number;
  isSaving: boolean;
}

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './stock-management.html',
  styleUrl: './stock-management.css'
})
export class StockManagement implements OnInit {
  rows: StockRow[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  filter: 'all' | 'low' | 'out' = 'all';
  imageBaseUrl = environment.apiBaseUrl;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.rows = data.map(p => ({ ...p, editedStock: p.stock, isSaving: false }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.errorMessage = 'Impossible de charger les produits.';
        this.isLoading = false;
      }
    });
  }

  get filteredRows(): StockRow[] {
    if (this.filter === 'low') {
      return this.rows.filter(r => r.stock > 0 && r.stock <= 5);
    }
    if (this.filter === 'out') {
      return this.rows.filter(r => r.stock === 0);
    }
    return this.rows;
  }

  get lowStockCount(): number {
    return this.rows.filter(r => r.stock > 0 && r.stock <= 5).length;
  }

  get outOfStockCount(): number {
    return this.rows.filter(r => r.stock === 0).length;
  }

  increment(row: StockRow): void {
    row.editedStock++;
  }

  decrement(row: StockRow): void {
    if (row.editedStock > 0) {
      row.editedStock--;
    }
  }

  hasChanged(row: StockRow): boolean {
    return row.editedStock !== row.stock;
  }

  saveStock(row: StockRow): void {
    if (row.editedStock < 0 || row.editedStock === row.stock) return;

    row.isSaving = true;
    this.productService.updateProduct(row._id, { stock: row.editedStock }).subscribe({
      next: (updated) => {
        row.stock = updated.stock;
        row.editedStock = updated.stock;
        row.isSaving = false;
      },
      error: (err) => {
        console.error('Error updating stock:', err);
        alert('Erreur lors de la mise à jour du stock.');
        row.isSaving = false;
      }
    });
  }
}
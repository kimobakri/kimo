import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {
  productId: string | null = null;
  name: string = '';
  description: string = '';
  price: number = 0;
  image: string = '';
  category: string = '';
  stock: number = 0;
  imageBaseUrl = environment.apiBaseUrl;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (data) => {
          this.name = data.name;
          this.description = data.description;
          this.price = data.price;
          this.image = data.image;
          this.category = data.category;
          this.stock = data.stock;
        },
        error: (err) => console.error(err)
      });
    }
  }
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitForm(): void {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.productService.uploadImage(formData).subscribe({
      next: (response) => {
        this.image = response.imageUrl;
        this.saveProduct();
      },
      error: (err) => console.error(err)
    });
  } else {
    this.saveProduct();
  }
}

saveProduct(): void {
  const productData = {
    name: this.name,
    description: this.description,
    price: this.price,
    image: this.image,
    category: this.category,
    stock: this.stock
  };

  if (this.productId) {
    this.productService.updateProduct(this.productId, productData).subscribe({
      next: () => { this.router.navigate(['/admin']); },
      error: (err) => console.error(err)
    });
  } else {
    this.productService.createProduct(productData).subscribe({
      next: () => { this.router.navigate(['/admin']); },
      error: (err) => console.error(err)
    });
  }
}
}
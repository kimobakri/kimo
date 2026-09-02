import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt?: string;}  
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

getProducts(filters?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Observable<Product[]> {
  let params = new URLSearchParams();

  if (filters?.search) params.set('search', filters.search);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.minPrice) params.set('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
  if (filters?.sort) params.set('sort', filters.sort);

  const url = params.toString() ? `${this.apiUrl}?${params.toString()}` : this.apiUrl;
  return this.http.get<Product[]>(url);
}
getProductById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.apiUrl}/${id}`);
}
createProduct(productData: any): Observable<Product> {
  return this.http.post<Product>(this.apiUrl, productData);
}
updateProduct(id: string, productData: any): Observable<Product> {
  return this.http.put<Product>(`${this.apiUrl}/${id}`, productData);
}
deleteProduct(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
uploadImage(formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/upload`, formData);
}
}
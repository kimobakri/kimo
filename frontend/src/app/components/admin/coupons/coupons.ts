import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CouponService, Coupon } from '../../../services/coupon';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coupons.html',
  styleUrl: './coupons.css'
})
export class Coupons implements OnInit {
  coupons: Coupon[] = [];

  code: string = '';
  discountType: 'percentage' | 'amount' = 'percentage';
  discountValue: number = 0;
  minOrderAmount: number = 0;
  startDate: string = '';
  endDate: string = '';
  isActive: boolean = true;
  private readonly apiUrl = '/api/coupons';

  constructor(
    private couponService: CouponService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.couponService.getCoupons().subscribe({
      next: (data) => { this.coupons = data; },
      error: (err) => console.error(err)
    });
  }

  addCoupon(): void {
    const newCoupon = {
      code: this.code,
      discountType: this.discountType,
      discountValue: this.discountValue,
      minOrderAmount: this.minOrderAmount,
      startDate: this.startDate,
      endDate: this.endDate,
      isActive: this.isActive
    };

    this.couponService.createCoupon(newCoupon).subscribe({
      next: () => {
        this.loadCoupons();
        this.resetForm();
      },
      error: (err) => console.error(err)
    });
  }

  toggleActive(coupon: Coupon): void {
    this.couponService.updateCoupon(coupon._id, { isActive: !coupon.isActive }).subscribe({
      next: () => { this.loadCoupons(); },
      error: (err) => console.error(err)
    });
  }

  deleteCoupon(id: string): void {
    this.couponService.deleteCoupon(id).subscribe({
      next: () => { this.loadCoupons(); },
      error: (err) => console.error(err)
    });
  }
  validateCoupon(code: string, orderTotal: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate`, { code, orderTotal });
  }

  resetForm(): void {
    this.code = '';
    this.discountValue = 0;
    this.minOrderAmount = 0;
    this.startDate = '';
    this.endDate = '';
    this.isActive = true;
  }
  
}
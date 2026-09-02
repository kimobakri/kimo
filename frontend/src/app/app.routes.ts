import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Products } from './components/products/products';
import { ProductDetails } from './components/product-details/product-details';
import { Cart } from './components/cart/cart';
import { Checkout } from './components/checkout/checkout';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { ProductForm } from './components/admin/product-form/product-form';
import { OrdersList } from './components/admin/orders-list/orders-list';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { ConfirmedOrders } from './components/admin/confirmed-orders/confirmed-orders';
import { Coupons } from './components/admin/coupons/coupons';
import { StockManagement } from './components/admin/stock-management/stock-management';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetails },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'login', component: Login },
  { path: 'admin', component: Dashboard, canActivate: [authGuard] },
  { path: 'admin/products/new', component: ProductForm, canActivate: [authGuard] },
  { path: 'admin/products/edit/:id', component: ProductForm, canActivate: [authGuard] },
  { path: 'admin/orders', component: OrdersList, canActivate: [authGuard] },
  { path: 'admin/confirmed-orders', component: ConfirmedOrders, canActivate: [authGuard] },
  { path: 'admin/coupons', component: Coupons, canActivate: [authGuard] },
  { path: 'admin/stock', component: StockManagement, canActivate: [authGuard] }
];
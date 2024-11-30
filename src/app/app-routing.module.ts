import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ProductComponent } from './product/product.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrderComponent } from './order/order.component';
import { SaleComponent } from './sale/sale.component';
import { RecoverComponent } from './recover/recover.component';
import { authGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'recover', component: RecoverComponent },
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
  { path: 'catalog', component: CatalogComponent, canActivate: [authGuard] },
  { path: 'product/:id', component: ProductComponent, canActivate: [authGuard] },
  { path: 'cart', component: ShoppingCartComponent, canActivate: [authGuard] },
  { path: 'cart/:id_prod', component: ShoppingCartComponent, canActivate: [authGuard] },
  { path: 'order/:id_car', component: OrderComponent, canActivate: [authGuard] },
  { path: 'sale', component: SaleComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

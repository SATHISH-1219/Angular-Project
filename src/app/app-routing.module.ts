import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './Components/cart/cart.component';
import { ProductsComponent } from './Components/products/products.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ForgetpswdComponent } from './Components/forgetpswd/forgetpswd.component';
import { DescriptionComponent } from './Components/description/description.component';
import { BuyComponent } from './Components/buy/buy.component';
import { AddProductComponent } from './Components/add-product/add-product.component';

const routes: Routes = [
  {path:'', redirectTo:'products',pathMatch:'full'},
  {path:'products', component: ProductsComponent},
  {path:'cart', component: CartComponent},
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path:'profile', component: ProfileComponent},
  {path:'forgetpswd', component: ForgetpswdComponent},
  {path:'description', component: DescriptionComponent},
  {path:'buy', component: BuyComponent},
  {path:'add-product', component: AddProductComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
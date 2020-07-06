import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductsComponent } from './components/products/products.component';
import { UsersComponent } from './components/users/users.component';
import {
  NgPluckPipeModule,
  NgCountPipeModule,
  NgSumPipeModule,
  NgFirstOrDefaultPipeModule,
  NgMapPipeModule,
} from 'angular-pipes';
import { CategoriesComponent } from './components/categories/categories.component';
import { OrdersComponent } from './components/orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    UsersComponent,
    CategoriesComponent,
    OrdersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NgPluckPipeModule,
    NgCountPipeModule,
    NgSumPipeModule,
    NgFirstOrDefaultPipeModule,
    NgMapPipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

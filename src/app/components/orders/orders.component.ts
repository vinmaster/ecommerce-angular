import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { PaymentStatus } from '../../models/payment-status';
import { FulfillmentStatus } from '../../models/fulfillment-status';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'order_date',
    'customer',
    'total',
    'payment_status',
    'fulfillment_status',
    'actions',
  ];
  dataSource$;
  form: FormGroup;
  formType: 'create' | 'update';
  error: string;
  payment_status = Object.values(PaymentStatus);
  fulfillment_status = Object.values(FulfillmentStatus);
  products: Product[] = [{ qty: 1 }];

  constructor(public dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      _id: new FormControl(''),
      customer_id: new FormControl(''),
      product_ids: new FormControl([]),
      payment_status: new FormControl(''),
      fulfillment_status: new FormControl(''),
    });

    this.dataSource$ = this.dataService.orders$;
  }

  openDialog(ref, resource?) {
    this.form.reset();
    this.products = [{ qty: 1 }];
    this.dialog.open(ref);
    if (resource) {
      this.form.patchValue(resource);
      this.loadProductsFromForm();
      this.formType = 'update';
    } else {
      this.formType = 'create';
    }
  }

  submit() {
    this.loadProductsIntoForm();
    if (this.formType === 'create') {
      this.dataService.createResource('orders', this.form.value);
    } else {
      this.dataService.updateResource('orders', this.form.value);
    }
  }

  removeResource(resource) {
    if (window.confirm('Are you sure?')) {
      this.dataService.removeResource('orders', resource);
    }
  }

  getPriceFromProductIds(product_ids: string[]) {
    return product_ids
      .map((id) => this.getProduct(id).price)
      .reduce((a, b) => a + b);
  }

  getProduct(id: string) {
    return this.dataService.productsSubject.value.find((p) => p._id === id);
  }

  addProduct() {
    this.products.push({ qty: 1 });
  }

  removeProduct(index) {
    this.products.splice(index, 1);
  }

  loadProductsIntoForm() {
    const product_ids = [];
    this.products = this.products.filter((p) => p._id);
    for (let i = 0; i < this.products.length; i++) {
      for (let j = 0; j < this.products[i].qty; j++) {
        product_ids.push(this.products[i]._id);
      }
    }
    this.form.controls.product_ids.setValue(product_ids);
  }

  loadProductsFromForm() {
    const products: Product[] = [];
    const map = this.stringCountMap(this.form.value.product_ids);
    for (let id of Object.keys(map)) {
      products.push({ _id: id, qty: map[id] });
    }
    this.products = products;
  }

  stringCountMap(arr: string[]) {
    return arr.reduce((acc, current) => {
      if (acc[current] === undefined) acc[current] = 0;
      acc[current] += 1;
      return acc;
    }, {} as { [key: string]: number });
  }
}

import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'categories',
    'price',
    'qty',
    'actions',
  ];
  dataSource$;
  form: FormGroup;
  formType: 'create' | 'update';
  error: string;

  constructor(public dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      _id: new FormControl(''),
      name: new FormControl(''),
      category_ids: new FormControl([]),
      price: new FormControl(),
      qty: new FormControl(0),
    });

    this.dataSource$ = this.dataService.products$;
  }

  openDialog(ref, resource?) {
    this.form.reset();
    this.dialog.open(ref);
    if (resource) {
      this.form.patchValue(resource);
      this.formType = 'update';
    } else {
      this.formType = 'create';
    }
  }

  submit() {
    if (this.formType === 'create') {
      this.dataService.createResource('products', this.form.value);
    } else {
      this.dataService.updateResource('products', this.form.value);
    }
  }

  removeResource(resource) {
    if (window.confirm('Are you sure?')) {
      this.dataService.removeResource('products', resource);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource$;
  form: FormGroup;
  formType: 'create' | 'update';
  error: string;

  constructor(public dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      _id: new FormControl(''),
      name: new FormControl(''),
    });

    this.dataSource$ = this.dataService.categories$;
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
      this.dataService.createResource('categories', this.form.value);
    } else {
      this.dataService.updateResource('categories', this.form.value);
    }
  }

  removeResource(resource) {
    if (window.confirm('Are you sure?')) {
      this.dataService.removeResource('categories', resource);
    }
  }
}

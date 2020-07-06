import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'username',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  dataSource$;
  form: FormGroup;
  formType: 'create' | 'update';
  error: string;

  constructor(private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      _id: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl(''),
    });

    this.dataSource$ = this.dataService.users$;
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
      this.dataService.createResource('users', this.form.value);
    } else {
      this.dataService.updateResource('users', this.form.value);
    }
  }

  removeResource(resource) {
    if (window.confirm('Are you sure?')) {
      this.dataService.removeResource('users', resource);
    }
  }
}

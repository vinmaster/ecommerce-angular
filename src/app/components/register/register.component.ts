import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  error: string;

  constructor(private dataService: DataService, private router: Router) {
    this.form = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      passwordConfirm: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  async submit() {
    if (this.form.value.password !== this.form.value.passwordConfirm) {
      this.error = 'Passwords must match';
      return;
    }
    if (this.form.valid) {
      try {
        const data = {
          username: this.form.value.username,
          password: this.form.value.password,
        };
        const user = await this.dataService.createResource('users', data);
        this.router.navigateByUrl('/login');
      } catch (error) {
        console.error(error);
        this.error = error.message;
      }
    }
  }
}

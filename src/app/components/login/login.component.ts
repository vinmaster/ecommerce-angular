import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: string;

  constructor(private dataService: DataService, private router: Router) {
    this.form = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  async submit() {
    if (this.form.valid) {
      try {
        const auth = await this.dataService.login({
          strategy: 'local',
          ...this.form.value,
        });
        if (auth) {
          this.router.navigateByUrl('/');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  //Creating form for login
  constructor(private fb: FormBuilder, private authService : AuthService) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._]+@[a-z]+\.[com]{3}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  //Authenticating login
  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.authService.login(username,password);
    }
  }
}
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgetpswd',
  templateUrl: './forgetpswd.component.html',
  styleUrls: ['./forgetpswd.component.css']
})
export class ForgetpswdComponent {
  forgetForm: FormGroup;
  public inputVisible: boolean = false;
  

  //Creating form for login
  constructor(private fb: FormBuilder, private router: Router) {
    this.forgetForm = fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._]+@[a-z]+\.[com]{3}$/)]],
      password: ['', [Validators.required, this.passwordStrengthValidator]]
    });
  }

  // Function to check password strength
  passwordStrengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (strongPasswordRegex.test(password)) {
      return null; // Password is strong
    } else {
      return { 'weakPassword': true }; // Password is weak
    }
  }

  

  checkUser() {
    const username = this.forgetForm.value.email;
    const existingUser = localStorage.getItem(username);
    
    if (!existingUser) {
      alert('Not a Existing User');
    }
    else{
      this.inputVisible = true;
      
    }  
  }

  updatePassword(){
    const username = this.forgetForm.value.email;
    const existingUser = localStorage.getItem(username) || '[]';
    const newPassword = this.forgetForm.value.password;
    const userData = JSON.parse(existingUser);
    userData.password = newPassword;
    localStorage.setItem(username, JSON.stringify(userData));
    alert("Password Changed Successfully")
    this.router.navigate(['/login']);

  }


}

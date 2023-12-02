import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { DataService } from 'src/app/Service/data.service';
import { AES } from 'crypto-ts';


interface Country {
  name: string;
  pattern: RegExp;
  countryCode: string;
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {

  todayDate!:Date;
  userForm!: FormGroup;
  countryCode: string = '+';
  countryCodes: Country[] = [
    { name: 'India', pattern: /^[1-9][0-9]{9}$/, countryCode: '+91' },
    { name: 'USA', pattern: /[2-9][0-9]{9}/, countryCode: '+1' },
    { name: 'UAE', pattern: /^[1-9][0-9]{8}$/, countryCode: '+971' },
  ];
  public countriesData:any;
  public availableStates:any;
  countryCtrl = new FormControl('');
  filteredStates!: Observable<Country[]>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog:MatDialog,
    private api: DataService
  ) {}

  ngOnInit() {

    this.api.getCountries()
    .subscribe(res=>{
      this.countriesData = res;
      console.log(this.countriesData)
    });
    this.userForm = this.formBuilder.group({
      firstName: ['',[Validators.required,Validators.pattern(/^[a-zA-Z]+$/),Validators.minLength(3)]],
      lastName: ['',[Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]],
      gender: [null,[Validators.required]],
      dateOfBirth: [null,[Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._]+@[a-z]+\.[com]{3}$/)]],
      state: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      retypePassword: ['',[Validators.required, this.passwordMatchValidator]]
    });

    this.filteredStates = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map(country => (country ? this._filterStates(country) : this.countryCodes.slice())),
    );
    
    //to change the validator pattern for phone number
    this.countryCtrl.valueChanges.subscribe((value: string | null) => {
      this.resetPhoneNumberValidators();
      if (value) {
        const selectedCountry = this.countryCodes.find(country => country.name === value);
        if (selectedCountry) {
          this.f['phoneNumber'].setValidators([
            Validators.required,
            Validators.pattern(selectedCountry.pattern),
          ]);
          this.countryCode = selectedCountry.countryCode;
        }
      }
    });

    this.todayDate = new Date();

    this.countryCtrl.valueChanges.subscribe((value: string | null) => {
      this.f['phoneNumber'].setValue('');
      const countryData = this.countriesData.find((countryInfo: any) => countryInfo.country === value);

    if (countryData) {
      this.userForm.get('State')?.setValue(''); // Reset the selected state
      this.availableStates = countryData.states;
    } else {
      this.availableStates = [];
    }});
  }

  get f() {
    return this.userForm.controls;
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

  //To validate the password and confirm password match
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  
    const password = control.root.get('password')?.value;
      if (password !== control.value) {
        return { 'passwordMismatch': true };
      }
      return null;
  }


  signUp() {

    const retypePassword = this.f['retypePassword'].value;
    const password = this.f['password'].value;

    if (retypePassword === password) {
      const username = this.userForm.value.email;
      const existingUser = localStorage.getItem(username);
      // Not an existing user
      if (!existingUser) {

        //Emcrypting Data to store in local storage 
        const encryptedData = AES.encrypt(JSON.stringify({
          email: this.f['email'].value,
          firstName: this.f['firstName'].value,
          lastName: this.f['lastName'].value,
          gender: this.f['gender'].value,
          dateOfBirth: this.onDateInput(),
          countryCode: this.countryCtrl.value,
          state: this.f['state'].value,
          phoneNumber: this.f['phoneNumber'].value,
          password: this.f['password'].value,
        }), 'gdhquetdhsfaget').toString();

        localStorage.setItem(username, encryptedData);
        this.openInvalidUserAlert('Signup successful');
        this.router.navigate(['/login']);
      } 
      //Existing user
      else {
        this.openInvalidUserAlert('Username already exists try login')
        this.router.navigate(['/login']);
      }
    }
    else{
      this.openInvalidUserAlert('password and confirm password does not match')
    }
  
  }

  onDateInput(): string {
    const selectedDate = this.userForm.value.dateOfBirth;
    const modifiedDate = `${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1}/${selectedDate.getDate()}`;
    return modifiedDate;
  }

  private _filterStates(value: string): Country[] {
    const filterValue = value.toLowerCase();

    return this.countryCodes.filter(country => country.name.toLowerCase().includes(filterValue));
  }

  openInvalidUserAlert(messageType: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { message: messageType },
    });
  }

  resetPhoneNumberValidators() {
    this.f['phoneNumber'].setValidators(Validators.required);
  }

}
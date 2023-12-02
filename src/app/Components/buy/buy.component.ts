import { Component } from '@angular/core';
import { DescriptionService } from 'src/app/Service/description.service';
import { CartService } from 'src/app/Service/cart.service';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DataService } from 'src/app/Service/data.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent {

  billingForm !: FormGroup;
  profileData: { name: string, email: string } = { name: '', email: '' }; 
  public quantity: number = 1;
  public singleProduct : any ;
  public totalItem : number = 0;
  public products : any = [];
  public grandTotal !: number;
  public productBill !: string;
  public countriesData : any ;
  public availableStates = [];
  public paymentMethod!: string;

  constructor(private fb: FormBuilder,private api : DataService,private data : DescriptionService, private cartService : CartService, private router: Router){}
  
  ngOnInit(): void {

    this.api.getCountries()
    .subscribe(res=>{
      this.countriesData = res;
      console.log(this.countriesData)
    });

    this.billingForm = this.fb.group({
      addresses: this.fb.array([]),
      address: ['', [Validators.required, Validators.minLength(3)]],
      address2: [''],
      email: ['', [Validators.pattern(/^[a-z0-9._]+@[a-z]+\.[com]{3}$/)]],
      country: ['',[Validators.required]],
      state: ['',[Validators.required]],
      zip: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]]
      });

    this.getLoginData();
    this.cartService.getProducts()
    .subscribe(res=>{
      this.totalItem = res.length;
    })
    this.cartService.getProducts()
    .subscribe(res=>{
      this.products = res;
      this.grandTotal = this.cartService.getTotalPrice();
    })
    this.data.getProduct()
    .subscribe(res=>{
      this.singleProduct = res;
    })
    this.productBill = this.cartService.bill();
  }

  countrySelected() {
    const selectedCountry = this.billingForm.get('country')?.value;
    const countryData = this.countriesData.find((countryInfo: any) => countryInfo.country === selectedCountry);

    if (countryData) {
      this.billingForm.get('State')?.setValue(''); // Reset the selected state
      this.availableStates = countryData.states;
    } else {
      this.availableStates = [];
    }
  }

  getLoginData(){
    const username = JSON.parse(localStorage.getItem('currentUser') || '[]');
    if(username == ''){
      this.router.navigate(['/login']);
    }
    else{
      this.profileData = {
        name: username.name,
        email: username.username
      }
    }

  }


  paymentMethodCheck(){

    const checkbox = document.getElementById('paymentMethod') as HTMLInputElement | null;

    if (checkbox?.checked) {
      this.paymentMethod = 'COD';
    } 
    else {
      this.paymentMethod = 'Online';
    }
  }

  confirm(){

    if(this.productBill == 'cart'){
    alert(`
           Name:${this.profileData.name}
           Email:${this.profileData.email}
           Address:${this.billingForm.value.address}
           ${this.billingForm.value.address2}
           Country:${this.billingForm.value.country}
           State:${this.billingForm.value.state}
           Zip:${this.billingForm.value.zip}
           Amount Paid:₹ ${this.grandTotal}`);
    }
    else{
    alert(`
           Name:${this.profileData.name}
           Email:${this.profileData.email}
           Address:${this.billingForm.value.address}
           ${this.billingForm.value.address2}
           Country:${this.billingForm.value.country}
           State:${this.billingForm.value.state}
           Zip:${this.billingForm.value.zip}
           Amount Paid:₹${this.singleProduct.price*this.quantity}`);
    }
  }
}

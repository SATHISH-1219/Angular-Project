import { Component,OnInit } from '@angular/core';
import { DescriptionService } from 'src/app/Service/description.service';
import { CartService } from 'src/app/Service/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit  {

  public product : any ;


  constructor(private description : DescriptionService,private cartService : CartService,private router: Router) { }

  ngOnInit(): void {
    this.description.getProduct()
    .subscribe(res=>{
      this.product = res;
    })
  }
  addtocart(item: any){
    this.cartService.addtoCart(item);
    this.router.navigate(['/cart']);
  }
  buyNow(item: any){
    this.description.setProduct(item);
    this.cartService.typeSet("product");
    this.router.navigate(['/buy']);
  }
}
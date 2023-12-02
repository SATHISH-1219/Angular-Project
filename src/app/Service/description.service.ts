import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

  public productData = new BehaviorSubject<any>([]);

  constructor() { }
  setProduct(product : any){
    this.productData.next(product);
    console.log(product);
  }
  getProduct(){
    return this.productData.asObservable();
  }

}

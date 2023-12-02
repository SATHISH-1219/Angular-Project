import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private productUrlBase = 'assets/products';
  private productUrlExtension = '.json';

  constructor(private http: HttpClient, private translate: TranslateService) {}

  //To change the json file based on the language
  private getProductUrl(): string {
    const currentLang = this.translate.currentLang || this.translate.defaultLang;
    const products = `${this.productUrlBase}/${currentLang}${this.productUrlExtension}`;
    return products;
  } 
  
  //Get products from the json file
  getProduct() {
    const productUrl = this.getProductUrl();

    return this.http.get<any>(productUrl)
      .pipe(map((res: any) => res));
  }

  getCountries() {
    return this.http.get<any>('assets/countries.json');
  }

  // Create: Add a new product
  addProduct(newProduct: any) {
    const productUrl = this.getProductUrl();

    return this.getProduct().pipe( // Read the existing products
      map((products: any[]) => {
        products.push(newProduct); // Add the new product
        console.log(products);
        return this.http.put(productUrl, products);
      })
    );
  }


}
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/Service/data.service';
import { CartService } from 'src/app/Service/cart.service';
import { DescriptionService } from 'src/app/Service/description.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  user:string = '';
  page:string = '';
  itemsPerPage: number = 20;
  pageIndex: number = 0;
  pagedItems: any[] = [];
  product = "none";
  productList! : any ;
  public filterCategory : any;
  public filterSubCategory : any;
  public priceCategory : any;
  searchKey:string ="";

  private languageChangeSubscription!: Subscription;

  constructor(private api : DataService,   private translate: TranslateService,  private cartService : CartService,private router : Router ,private description : DescriptionService) {
    // Subscribe to language change events
    this.languageChangeSubscription = this.translate.onLangChange.subscribe(() => {
      // Reload products on language change
      this.ngOnInit();
    });
   }

  ngOnInit(): void {
    this.api.getProduct().subscribe(
      (res) => {
        this.productList = res;
        this.filterCategory = res;
        this.productList.forEach((a: any) => {
          Object.assign(a, { quantity: 1, total: a.price });
        });

      // Set the initial page of products
      this.pageIndex = 0; // Display the first page
      this.itemsPerPage = 20; // Items per page
      const startIndex = this.pageIndex * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.pagedItems = this.productList.slice(startIndex, endIndex);

      console.log(this.productList);

      //Authenticate as admin or not 
      const username = JSON.parse(localStorage.getItem('currentUser') || '[]');
      if(username.username === 'admin@admin.com'){
        this.user = 'admin';
      }
      else{
        this.user = '';
      }

      this.page = 'home';

    },
    (error: HttpErrorResponse) => {
      // Handle HTTP request errors
      if (error.status === 400) {
        console.error('Bad request error:', error);
        // Display an error message to the user for a bad request
      } else if (error.status === 500) {
        console.error('Internal server error:', error);
        // Display an error message to the user for an internal server error
      } else {
        console.error('An unexpected error occurred:', error);
        // Display a generic error message for other unexpected errors
      }
    });

    this.cartService.search.subscribe((val: any) => {
      this.searchKey = val;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from language change events to prevent memory leaks
    this.languageChangeSubscription.unsubscribe();
  }
  addtocart(item: any){
    this.cartService.addtoCart(item);
  }

  onPageChange(event: any) {
    this.itemsPerPage = event.pageSize;
    this.pageIndex = event.pageIndex;

    // Calculate the starting index for the current page
    const startIndex = this.pageIndex * this.itemsPerPage;

    // Calculate the ending index for the current page
    const endIndex = startIndex + this.itemsPerPage;

    // Update pagedItems to display the products for the current page
    this.pagedItems = this.filterCategory.slice(startIndex, endIndex);

    this.scrollToTop();

  }


  filter(category:string){
    this.filterCategory = this.productList
    .filter((a:any)=>{
      if(a.category == category || category==''){
        return a;
      }
    })
    //To refresh paged item list after the category is selected
    this.pagedItems = this.filterCategory;
    this.itemsPerPage = 20; // Items per page
    this.pageIndex = 0; // Display the first page

    if(category == ''){
      this.page = 'home';
    }
    else{
      this.page = '';
    }

  }

  subFilter(Category:string){
    this.filterCategory = this.productList
    .filter((a:any)=>{
      if(a.subCategory == Category || Category==''){
        return a;
      }
    })
    //To refresh paged item list after the sub category is selected
    this.pagedItems = this.filterCategory;
    this.itemsPerPage = 20; // Items per page
    this.pageIndex = 0; // Display the first page

    if(Category == ''){
      this.page = 'home';
    }
    else{
      this.page = '';
    }

  }

priceFilter(price: number) {
  this.pagedItems = this.filterCategory.filter((product: any) => {
    switch (price) {
      case 0:
        return product.price >= 0 && product.price <= 100;
      case 1:
        return product.price > 100 && product.price <= 200;
      case 2:
        return product.price > 200 && product.price <= 300;
      case 3:
        return product.price > 300 && product.price <= 400;
      case 4:
        return product.price > 400 && product.price <= 500;
      case 5:
        return product.price > 500;
      case 6:
        this.productList.sort((low: any, high: any) => low.price - high.price); // Low to High
        return true
      case 7:
        this.productList.sort((low: any, high: any) => high.price - low.price); // High to Low
        return true
      default:
        this.ngOnInit();
        return true; // Show all products if price filter doesn't match
    }
  });

  if(price == 8){
    this.page = 'home';
  }
  else{
    this.page = '';
  }
}


  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  buyNow(item: any){
    this.description.setProduct(item);
    this.cartService.typeSet("product");
    this.router.navigate(['/buy']);
  }
  descriptionShow(item: any){
    this.description.setProduct(item);
  }

}
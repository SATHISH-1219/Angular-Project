import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/Service/cart.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public language: string = 'en';
  public totalItem : number = 0;
  public searchTerm !: string;

  constructor(private cartService : CartService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.cartService.getProducts()
    .subscribe(res=>{
      this.totalItem = res.length;
    })
  }
  search(event:any){
    this.searchTerm = (event.target as HTMLInputElement).value;
    console.log(this.searchTerm);
    this.cartService.search.next(this.searchTerm);
  }

  changeLanguage(lang: string): void {
    this.language = lang;
    this.translate.use(lang);
  }

}
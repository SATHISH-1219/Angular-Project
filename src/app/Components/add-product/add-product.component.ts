import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/Service/data.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {

  category:any = [{
                  "category": "Fashion",
                  "subCategory": [
                  "T-Shirt", "Jacket", "Shirt",
                  ]
                  },
                  {
                    "category": "Electronics",
                    "subCategory": [
                    "HDD", "SSD", "Monitor",
                  ]
                  },
                  {
                    "category": "Jewelery",
                    "subCategory": [
                    "Ring", "Ear Ring", "Bracelet",
                  ]
                  },  
                ]
  public availableSubCategory = [];


  addProductForm!: FormGroup;

  constructor(private fb: FormBuilder, private DataService: DataService){}

  ngOnInit(): void {
    this.addProductForm = this.fb.group({
      title: ['', [Validators.required]],
      price: ['',[Validators.required]],
      description: ['', [Validators.required]],
      category: ['',[Validators.required]],
      subCategory: ['',[Validators.required]],
      image: ['',[Validators.required]]
      });

  }

  categorySelected() {
    const selectedCategory = this.addProductForm.get('category')?.value;
    const category = this.category.find((categoryInfo: any) => categoryInfo.category === selectedCategory);

    if (category) {
      this.addProductForm.get('subCategory')?.setValue(''); // Reset the selected subcategory
      this.availableSubCategory = category.subCategory;
    } else {
      this.availableSubCategory = [];
    }
  }


  confirm(){
    const newProduct: any = {
      "title":this.addProductForm.value.title,
      "price":this.addProductForm.value.price,
      "description":this.addProductForm.value.description,
      "category":this.addProductForm.value.category,
      "subCategory":this.addProductForm.value.subCategory,
      "image":this.addProductForm.value.image
    };
    alert(this.addProductForm.value.title)
    this.DataService.addProduct(newProduct).subscribe(() => {
    });
  }

} 

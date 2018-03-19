import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodRoutesModule } from './food-routes.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
// Component //
import { FoodComponent } from './food/food.component';
import { CategoryComponent } from './category/category.component';
import { RestourantComponent } from './restourant/restourant.component';
import { CategortFormComponent } from './category/categort-form.component';
// Service //
import { CategoryService } from '../services/category.service';
import { RestourantService } from '../services/restourant.service';

@NgModule({
  imports: [
    CommonModule,
    FoodRoutesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    FoodComponent,
    CategoryComponent,
    RestourantComponent,
    CategortFormComponent
  ],
  providers:[
    CategoryService,
    RestourantService
  ]
})
export class AppFoodModule { }

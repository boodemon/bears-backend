import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';
//Component
import { FoodComponent } from './food/food.component';
import { RestourantComponent } from './restourant/restourant.component';
import { CategoryComponent } from './category/category.component';

const routes:Routes = [
  {
    path:'',
    children:[
      {
          path:'food',
          component:FoodComponent,
          data:{
            title:'Food data menu'
          }
      },
      {
        path:'category',
        component:CategoryComponent,
        data:{
          title: 'Category foods'
        }
      },
      {
        path:'restourant',
        component:RestourantComponent,
        data:{
          title: 'Restourant of foods'
        }
      }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class FoodRoutesModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SpecModelComponent } from './spec-model.component';
import { FormModelComponent } from './form-model.component';

const routes:Routes = [
  {
    path:'',
    children:[
      {
        path:'',
        component:SpecModelComponent,
      },
      {
        path:'form',
        component:FormModelComponent,
        data:{
          title:'FORM SPEC MODEL'
        }
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModelRouteModule { }

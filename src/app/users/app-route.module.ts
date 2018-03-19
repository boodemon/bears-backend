import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list.component';
import { UserFormComponent } from './user-form.component';

const routes:Routes = [
  {
    path:'',
    children:[
      {
        path:'',
        component:UserListComponent,
      },
      {
        path:'form',
        component:UserFormComponent,
        data:{
          title:'New / Update user'
        }
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppRouteModule { }

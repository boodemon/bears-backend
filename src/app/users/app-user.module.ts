import { NgModule } from '@angular/core';
import { AppRouteModule } from './app-route.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { UserFormComponent } from './user-form.component';

@NgModule({
  imports: [
    CommonModule,
    AppRouteModule,
    ModalModule.forRoot(),
    FormsModule
  ],
  declarations: [
    UserListComponent, 
    UserFormComponent
  ],
  providers:[
    UserFormComponent
  ]
})
export class AppUserModule { }

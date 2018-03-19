import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgAutoCompleteModule } from 'ng-auto-complete';
import { CommonModule } from '@angular/common';
import { FormModelComponent } from './form-model.component';
import { SpecModelComponent } from './spec-model.component';
import { ModelRouteModule } from './model-route.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    ModelRouteModule,
    BsDatepickerModule.forRoot(),
    NgAutoCompleteModule,
    FormsModule,
  ],
  declarations: [
    FormModelComponent,
    SpecModelComponent
  ]
})
export class SpecModelModule { }

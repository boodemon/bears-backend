import { NgModule } from '@angular/core';
import { BsDatepickerModule,BsDropdownModule ,TooltipModule, ModalModule} from 'ngx-bootstrap';
import { NgAutoCompleteModule } from 'ng-auto-complete';
import { CommonModule } from '@angular/common';
import { FormModelComponent } from './form-model.component';
import { SpecModelComponent } from './spec-model.component';
import { ModelRouteModule } from './model-route.module';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { SpeceService } from '../services/spece.service';

@NgModule({
  imports: [
    CommonModule,
    ModelRouteModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgAutoCompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FormModelComponent,
    SpecModelComponent,
  ],
  providers: [
    SpeceService

    ]
})
export class SpecModelModule { }

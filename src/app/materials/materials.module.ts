import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsRoutingModule } from './materials-routing.module';
import { BsDatepickerModule,BsDropdownModule ,TooltipModule, ModalModule} from 'ngx-bootstrap';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { PoComponent } from './po.component';
import { OrdersComponent } from './orders.component';
import { OrdoersPrintComponent } from './ordoers-print.component';
import { OrderFormComponent } from './order-form.component';
import { PoFormComponent } from './po-form.component';
import { PoPrintComponent } from './po-print.component';

@NgModule({
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MaterialsRoutingModule
  ],
  declarations: [
    OrdersComponent, 
    OrdoersPrintComponent, 
    PoComponent, 
    OrderFormComponent, PoFormComponent, PoPrintComponent
  ]
})
export class MaterialsModule { }

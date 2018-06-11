import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SheetRouteModule } from '../spec-sheet/sheet-route.module';
import { SpecSheetComponent } from '../spec-sheet/spec-sheet.component';

import { BsDropdownModule,BsDatepickerModule, TooltipModule } from 'ngx-bootstrap';
import { FormCojComponent } from './form-coj.component';
import { FormCtcComponent } from './form-ctc.component';
import { FormStandardComponent } from './form-standard.component';

import { AuthService } from '../services/auth.service';
import { OrderSheetService } from '../services/order-sheet.service';
import { PrintCojComponent } from './print-coj.component';
import { PrintCtcComponent } from './print-ctc.component';
import { PrintStandardComponent } from './print-standard.component';
import { SpecCardComponent } from '../spec-card/spec-card.component';


@NgModule({
  imports: [
    CommonModule,
    SheetRouteModule,
    BsDropdownModule,
    BsDatepickerModule,
    FormsModule,
    TooltipModule
  ],
  declarations: [
    SpecSheetComponent,
    FormCojComponent,
    FormCtcComponent,
    FormStandardComponent,
    PrintCojComponent,
    PrintCtcComponent,
    PrintStandardComponent,
    SpecCardComponent,
  ],
  providers:[
    AuthService,
    OrderSheetService
  ]
})
export class SheetModuleModule { }

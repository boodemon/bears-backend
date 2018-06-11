import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SpecSheetComponent } from './spec-sheet.component';
import { FormCojComponent } from './form-coj.component';
import { FormCtcComponent } from './form-ctc.component';
import { FormStandardComponent } from './form-standard.component';
import { PrintCojComponent } from './print-coj.component';
import { PrintCtcComponent } from './print-ctc.component';
import { PrintStandardComponent } from './print-standard.component';
import { SpecCardComponent } from '../spec-card/spec-card.component';

const routes : Routes = [{
  path : '',
  children : [
    {
      path : '',
      component:SpecSheetComponent,
      data:{
        title : 'ORDER SHEET'
      }
    },
    {
      path : 'form-coj',
      component:FormCojComponent,
      data:{
        title : 'NEW COJ FORM'
      }
    },
    {
      path: 'form-ctc',
      component:FormCtcComponent,
      data:{
        title : 'NEW CTC FORM'
      }
    },
    { 
      path: 'form-standard',
      component:FormStandardComponent,
      data:{
        title : 'NEW STANDARD FORM'
      }
    },
    {
      path : 'form-coj/:id',
      component:FormCojComponent,
      data:{
        title : 'UPDATE COJ FORM'
      }
    },
    {
      path: 'form-ctc/:id',
      component:FormCtcComponent,
      data:{
        title : 'UPDATE CTC FORM'
      }
    },
    { 
      path: 'form-standard/:id',
      component:FormStandardComponent,
      data:{
        title : 'UPDATE STANDARD FORM'
      }
    },
    {
      path : 'print-coj/:id',
      component:PrintCojComponent,
      data:{
        title : 'FORM PRINTING'
      }
    },
    {
      path: 'print-ctc/:id',
      component:PrintCtcComponent,
      data:{
        title : 'FORM PRINTING'
      }
    },
    {
      path: 'print-standard/:id',
      component:PrintStandardComponent,
      data:{
        title : 'FORM PRINTING'
      }
    },
    {
      path: 'order-card/:id',
      component:SpecCardComponent,
      data:{
        title : 'ORDER CARD'
      }
    },
    
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetRouteModule { }
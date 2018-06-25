import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { OrdoersPrintComponent } from './ordoers-print.component';
import { PoComponent } from './po.component';
import { PoFormComponent } from './po-form.component';
import { OrderFormComponent } from './order-form.component';

const routes : Routes = [{
  path : '',
  children : [
    {
      path : '',
      component:OrdersComponent,
      data:{
        title : 'MATERIALS ORDER'
      }
    },
    {
      path : 'orders',
      component:OrdersComponent,
      data:{
        title : 'MATERIALS ORDER'
      }
    },
    {
      path : 'orders/form',
      component:OrderFormComponent,
      data:{
        title : 'MATERIALS ORDER FORM'
      }
    },
    {
      path : 'orders/form/:id',
      component:OrderFormComponent,
      data:{
        title : 'MATERIALS ORDER UPDATE FORM'
      }
    },
    {
      path : 'orders/form/:id/:print',
      component:OrderFormComponent,
      data:{
        title : 'MATERIALS ORDER'
      }
    },
    {
      path : 'po',
      component:PoComponent,
      data:{
        title : 'PO STOCK'
      }
    },
    {
      path : 'po/form',
      component:PoFormComponent,
      data:{
        title : 'PO FORM'
      }
    },
    {
      path : 'po/form/:id',
      component:PoFormComponent,
      data:{
        title : 'MATERIALS FORM UPDATE'
      }
    },
    {
      path : 'po/form/:id/:print',
      component:PoFormComponent,
      data:{
        title : 'PO STOCK'
      }
    },
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialsRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';

// Component //
import { MemberComponent } from './member.component';

const routes:Routes = [
    {
      path:'',
      children:[
        {
            path:'',
            component: MemberComponent,
            data:{
              title:'Mobile app Member'
            }
        }
      ]
    },

]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ],
  declarations: []
})
export class MemberRouteModule { }

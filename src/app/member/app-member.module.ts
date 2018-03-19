import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberRouteModule } from './member-route.module';

// Component //
import { MemberComponent } from './member.component';

@NgModule({
  imports: [
    CommonModule,
    MemberRouteModule,
    
  ],
  declarations: [
    MemberComponent
  ]
})
export class AppMemberModule { }

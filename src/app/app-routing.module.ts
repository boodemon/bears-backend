import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { FullLayoutComponent } from './layouts/full-layout.component';
import { ReportComponent } from './report/report.component';
import { MemberComponent } from './member/member.component';
import { CheckComponent } from './auth/check/check.component';
import { LogoutComponent } from './Auth/logout/logout.component';


const routes: Routes = [
  {
    path:'',
    component:CheckComponent
    /*
    redirectTo:'login',
    pathMatch:'full'
    */
  },

  {
    path: 'login',
    component: LoginComponent,
    data:{
      title:'Administrator Login'
    }
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    data:{
      title:'Administrator Forgot password'
    }
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'HOME'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },

      {
        path: 'spec-model',
        loadChildren:'./spec-model/spec-model.module#SpecModelModule',
        data : {
          title:'SPEC MODEL'
        }
      },
      {
        path: 'spec-sheet',
        loadChildren:'./spec-sheet/sheet-module.module#SheetModuleModule',
        data : {
          title:'SPEC ORDER SHEET'
        }
      },
      {
        path: 'materials',
        loadChildren:'./materials/materials.module#MaterialsModule',
        data : {
          title:'MATERIALS ORDER'
        }
      },

      {
        path:'users',
        loadChildren:'./users/app-user.module#AppUserModule',
      },
      {
        path: 'logout',
        component:LogoutComponent
      },
    ]
  },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }

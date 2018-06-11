import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { BsDropdownModule, BsDatepickerModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
import { LoginComponent } from './auth/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from 'ngx-loading';
// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SidebarAdminComponent } from './layouts/sidebar-admin.component';
import { SidebarSpecComponent } from './layouts/sidebar-spec.component';
import { SidebarPurchaseComponent } from './layouts/sidebar-purchase.component';
import { SidebarExportComponent } from './layouts/sidebar-export.component';

import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { CheckComponent } from './auth/check/check.component';

// Service
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { LogoutComponent } from './Auth/logout/logout.component';
import { SpeceService} from './services/spece.service';

// Child module //
import { AppUserModule } from './users/app-user.module';
import { AppMemberModule } from './member/app-member.module';
import { SelectallDirective } from './directive/selectall.directive';
import { SpecModelModule } from './spec-model/spec-model.module';
import { SearchComponent } from './shared/search.component';
import { SheetModuleModule } from './spec-sheet/sheet-module.module';
import { ReportComponent } from './report/report.component';
import { MaterialsModule } from './materials/materials.module';
import { MaterialsService } from './services/materials.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    FullLayoutComponent,
    SimpleLayoutComponent,
    ForgotComponent,
    CheckComponent,
    LogoutComponent,
    SelectallDirective,
    SidebarAdminComponent,
    SidebarSpecComponent,
    SidebarPurchaseComponent,
    SidebarExportComponent,
    SearchComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    AppUserModule,
    AppMemberModule,
    SpecModelModule,
    LoadingModule,
    SheetModuleModule,
    MaterialsModule,
  ],
  providers: [
    {
        provide: LocationStrategy,
        useClass: HashLocationStrategy,    
    },
    UsersService,
    AuthService,
    SpeceService,
    MaterialsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

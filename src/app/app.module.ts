import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {AppRoutes} from './app.routes';
import {
  CardModule,
  EmptyStateModule,
  NotificationService,
  TableModule,
  ToastNotificationListModule,
  VerticalNavigationModule
} from 'patternfly-ng';
import {BsDropdownModule} from 'ngx-bootstrap';
import {CardComponent} from './card/card.component';
import {TableComponent} from './table/table.component';
import {HomeComponent} from './home/home.component';
import {NavComponent} from './nav/nav.component';
import {BreadcrumbsModule} from '@exalif/ngx-breadcrumbs';

import { ProjectService } from './projects/project.service';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './projects/project-detail.component';
import { ProjectInputComponent } from './projects/project-input.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MarathonInterceptor } from './common/marathon.interceptor';
import { MarathonAppInterceptor } from './containerservices/marathon-app.interceptor';
import { ProjectInterceptor } from './projects/project.interceptor';
import { MarathonFakeInterceptor } from './containerservices/marathon-fake.interceptor';
import { MarathonProjectFakeInterceptor } from './projects/marathon-project-fake.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    TableComponent,
    HomeComponent,
    NavComponent,
    ProjectsComponent,
    ProjectDetailComponent,
    ProjectInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes),
    BreadcrumbsModule.forRoot(),
    VerticalNavigationModule,
    ToastNotificationListModule,
    EmptyStateModule,
    TableModule,
    CardModule,
    BsDropdownModule.forRoot()
  ],
  providers: [
    NotificationService,
    ProjectService,
    { provide: HTTP_INTERCEPTORS, useClass: MarathonInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MarathonAppInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ProjectInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MarathonFakeInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MarathonProjectFakeInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

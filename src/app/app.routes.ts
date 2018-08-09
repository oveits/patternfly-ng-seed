import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {CardComponent} from './card/card.component';
import {TableComponent} from './table/table.component';
import {ProjectsComponent} from './projects/projects.component';

export const AppRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      breadcrumbs: true,
      text: 'Home'
    },
    children: [
      {
        path: 'card',
        component: CardComponent,
        data: {
          breadcrumbs: true,
          text: 'Card'
        }
      },
      {
        path: 'table',
        component: TableComponent,
        data: {
          breadcrumbs: true,
          text: 'Table'
        }
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        data: {
          breadcrumbs: true,
          text: 'Projects'
        }
      }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

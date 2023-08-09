import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialMenuComponent } from 'ng-accounting'
import { UsersComponent } from './modules/users/users.component';
import { UserDepartmentsComponent } from './modules/user-departments/user-departments.component';
import { UserCardComponent } from './modules/users/user-card/user-card.component';

const routes: Routes = [
  {
    path: 'api/v1/modules',
    pathMatch: 'full',
    component: InitialMenuComponent,
    data: {
      menuList: [
        {
          label: 'Настройки пользователей и прав',
          links: [
            {
              label: 'Пользователи',
              link: 'users'
            },
            {
              label: 'Групы пользователей',
              link: 'user-departments'
            }
          ]
        }
      ]
    }
  },
  {
    path: 'api/v1/modules/users',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UsersComponent
      },
      {
        path: ':id',
        component: UserCardComponent
      }]
  },
  {
    path: 'api/v1/modules/user-departments',
    component: UserDepartmentsComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

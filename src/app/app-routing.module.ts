import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent},

    { path: 'employees', loadChildren: () => 
      import('./employee/employee.module').then(m => m.EmployeeModule),
    },

    {
      path: 'admin', loadChildren: () =>
        import('./admin/admin.module').then(m => m.AdminModule)
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

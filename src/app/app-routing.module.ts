import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RefurbishmentOperationComponent } from './components/operation/refurbishment-operation/refurbishment-operation.component';
import { RepairOperationComponent } from './components/operation/repair-operation/repair-operation.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'refurbishment', component: RefurbishmentOperationComponent, canActivate: [authGuard]},
  { path: 'repair', component: RepairOperationComponent,  canActivate: [authGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

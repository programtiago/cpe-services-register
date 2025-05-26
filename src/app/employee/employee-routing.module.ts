import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefurbishmentOperationComponent } from './components/operation/refurbishment-operation/refurbishment-operation.component';
import { authGuard } from '../auth/guards/auth.guard';
import { RepairOperationComponent } from './components/operation/repair-operation/repair-operation.component';

const routes: Routes = [
  { path: 'refurbishment', component: RefurbishmentOperationComponent, canActivate: [authGuard]},
  { path: 'repair', component: RepairOperationComponent,  canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }

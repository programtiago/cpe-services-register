import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { CustomSnackbarComponent } from '../shared/custom-snackbar/custom-snackbar.component';
import { AppMaterialModule } from '../shared/app-material/app-material.module';
import { RefurbishmentOperationComponent } from './components/operation/refurbishment-operation/refurbishment-operation.component';

@NgModule({
  declarations: [
    CustomSnackbarComponent,
    RefurbishmentOperationComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    AppMaterialModule
  ]
})
export class EmployeeModule { }

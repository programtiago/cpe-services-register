import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './components/header/header.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './components/auth/login/login.component';
import { AppMaterialModule } from './shared/app-material/app-material.module';
import { RefurbishmentOperationComponent } from './components/operation/refurbishment-operation/refurbishment-operation.component';
import { RepairOperationComponent } from './components/operation/repair-operation/repair-operation.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    RefurbishmentOperationComponent,
    RepairOperationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

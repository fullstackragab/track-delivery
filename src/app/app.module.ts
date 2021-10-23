import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderStatusComponent } from './order-status/order-status.component';
// import { MyLibMapModule } from './my-lib';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import { AddressDirective } from './address.directive';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { Ng2CompleterModule } from "ng2-completer";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    OrderStatusComponent,
    AddressDirective,
    AccountComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapboxToken,
      // geocoderAccessToken: 'TOKEN'
    }),
    Ng2CompleterModule,
    FormsModule
    // MyLibMapModule.forRoot({
    //   mapboxToken: environment.mapboxToken,
    // }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

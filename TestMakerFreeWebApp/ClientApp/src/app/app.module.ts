import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { NavTopComponent } from './components/nav-top/nav-top.component';
import { TesteComponent } from './components/teste/teste.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { CanActivateDefault, CanActivateAdmin } from './services/can-activate';
import { AuthResponseInterceptor } from './services/auth-response-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavTopComponent,
    NavMenuComponent,
    AboutComponent,
    PageNotFoundComponent,
    TesteComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    CanActivateAdmin,
    CanActivateDefault,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthResponseInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

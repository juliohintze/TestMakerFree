import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HelperModule } from '../helper-module/helper.module';
import { QuizModule } from '../quiz-module/quiz.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserRoutingModule } from './user-routing.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent
  ],
  exports: [
    UserListComponent
  ],
  imports: [
    UserRoutingModule,
    HelperModule,
    QuizModule,
    RouterModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }

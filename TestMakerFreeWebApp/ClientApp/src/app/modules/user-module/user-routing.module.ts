import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserListComponent } from "./components/user-list/user-list.component";
import { CanActivateDefault } from "src/app/services/can-activate";
import { UserDetailComponent } from "./components/user-detail/user-detail.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'all' },
  { path: 'all', component: UserListComponent, canActivate: [CanActivateDefault] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [CanActivateDefault] },
  { path: ':id', component: UserDetailComponent, canActivate: [CanActivateDefault] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule { }
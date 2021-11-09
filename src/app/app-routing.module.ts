import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionComponent } from './action/action.component';
import { AdminComponent } from './admin/admin.component';
import { AccountComponent } from './auth/account/account.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { ReverseAuthGuardGuard } from './auth/reverse-auth-guard.guard';
import { RoleGuard } from './auth/role.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: "admin", component: AdminComponent, canActivate: [RoleGuard], data: {expectedRole: ["admin"]}},
  {path: "login", component: LoginComponent, canActivate: [ReverseAuthGuardGuard]},
  {path: "account", component: AccountComponent, canActivate: [AuthGuard]},
  {path: "action", component: ActionComponent},
  {path: "", component: HomeComponent},
  {path: "**", component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

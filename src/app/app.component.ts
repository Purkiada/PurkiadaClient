import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'PurkiadaClient';

  public loggedIn: boolean;
  public user?: User;
  public isAdmin: boolean = false;

  public constructor(private readonly authService: AuthService){
    this.authService.init();
    this.loggedIn = this.authService.isLoggedIn();

    this.authService.getLoggedInObservable().subscribe(
      (state) => {
        this.loggedIn = state;
        this.checkUser();
      }
    );
    this.checkUser();
  }

  public checkUser(){
    if(this.authService.isLoggedIn()){
      this.user = this.authService.getUser();
      this.isAdmin = this.user.hasRole("admin");
    }
  }

  public logout(){
    this.authService.logout();
  }
}

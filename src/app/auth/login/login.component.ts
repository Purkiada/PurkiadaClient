import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    if(!authService.isLoggedIn()){
      authService.login();
    }
  }

  ngOnInit(): void {
  }

}

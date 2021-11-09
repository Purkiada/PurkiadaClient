import { Injectable } from '@angular/core';
import { NullValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { User } from './user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private decodedAccessToken: any;
  private decodedIdToken: any;

  private loggedInSource = new Subject<boolean>();

  public getLoggedInObservable() {
    return this.loggedInSource.asObservable();
  }

  public registerLoginState(state: boolean){
    this.loggedInSource.next(state);
  }

  constructor(private readonly oauthService: OAuthService) {
    this.oauthService.events.subscribe((event)=> {
      if(event.type == "token_received"){
        this.registerLoginState(true);
      }
    });
  }

  public async init(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.oauthService.configure(authConfig);
      this.oauthService.setStorage(localStorage);
      this.oauthService.tokenValidationHandler = new NullValidationHandler();

      this.oauthService.loadDiscoveryDocumentAndTryLogin().then(
        (isLoggedIn) => {
          if (isLoggedIn) {
            this.oauthService.setupAutomaticSilentRefresh();
            resolve(null);
          }
        });
    });
  }

  public isLoggedIn(): boolean {
    let isTokenExpired = this.oauthService.getAccessTokenExpiration() <= new Date().getTime();
    return this.oauthService.getAccessToken() != null && !isTokenExpired;
  }

  public login() {
    this.oauthService.initCodeFlow();
  }

  public logout() {
    this.oauthService.logOut();
  }

  private getClaims(): any {
    return this.oauthService.getIdentityClaims();
  }

  public getAccessToken() {
    return localStorage.getItem("access_token");
  }

  private getAllClaims(): any {
    const helper = new JwtHelperService();
    let accessToken = this.getAccessToken();
    if (accessToken) {
      return helper.decodeToken(accessToken);
    }
    return null;
  }

  public getUser(): User {
    let claims = this.getClaims();
    return new User(claims["sub"], claims["preferred_username"], claims["email"], claims["given_name"], claims["family_name"], this.getAllClaims()["realm_access"]["roles"]);
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this.authService.isLoggedIn() && request.url.includes("localhost")){
      
      let headers = new HttpHeaders({
        "Authorization": `Bearer ${this.authService.getAccessToken()}`
      });

      if(request.headers.has("Content-Type")){
        //@ts-ignore
        headers = headers.append("Content-Type", request.headers.get("Content-Type"));
      }
      const authRequest = request.clone(
        {
          headers: headers
        }
      );
      return next.handle(authRequest);
    }
    return next.handle(request);
  }
}

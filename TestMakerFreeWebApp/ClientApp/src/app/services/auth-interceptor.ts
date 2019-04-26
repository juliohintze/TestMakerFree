import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth-service";

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let auth = this.authService.getAuth();
        let token = auth && auth.token;
        let dupReq = token ? req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
        }) : req;

        return next.handle(dupReq);
    }
}
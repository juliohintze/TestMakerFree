import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from "@angular/common/http";
import { AuthService } from "./auth-service";
import { Router } from "@angular/router";
import { Observable, throwError, of } from "rxjs";
import { catchError, switchMap } from 'rxjs/operators';
import { TokenResponse } from "../models/token-response";
import { IGNORE_INTERCEPTION } from "../shared/ignore-interception";

@Injectable({
    providedIn: 'root'
})

export class AuthResponseInterceptor implements HttpInterceptor {

    currentRequest: HttpRequest<any>;

    constructor(private auth: AuthService,
                private router: Router,
                private http: HttpClient) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let auth: TokenResponse;
        let token: string;
        let urlsToIgnore = IGNORE_INTERCEPTION;

        if (urlsToIgnore.includes(request.url))
            return next.handle(request);

        auth = this.auth.getAuth();
        token = auth && auth.token;
        if (token) {
            return next.handle(request).pipe(
                catchError(err => {
                    if (err.status === 401) {
                        // JWT token might be expired:
                        // try to get a new one using refresh token
                        console.log('Token expired. Attempting refresh...');

                        return this.auth.refreshToken().pipe(
                            switchMap(res => {
                                return this.http.request(request);
                            }),
                            catchError(err => {
                                // refresh token failed
                                console.log('refresh token failed');

                                // erase current token
                                this.auth.logout();

                                // redirect to login page
                                this.router.navigate(['user/login']);

                                return throwError(err);
                            })
                        )
                    }
                })
            )
        } else {
            return next.handle(request);
        }
    }
}
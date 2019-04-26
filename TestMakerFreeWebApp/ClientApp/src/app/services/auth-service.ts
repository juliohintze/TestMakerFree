import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TokenResponse } from "../models/token-response";
import { HttpClient } from "@angular/common/http";
import { TokenRequest } from "../models/token-request";
import { tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    authKey = 'auth';
    clientId = 'TestMakerFree';
    url = 'api/token/auth';

    constructor(private http: HttpClient) { }

    // performs the login
    login(tokenRequest: TokenRequest): Observable<TokenResponse> {
        return this.http.post<TokenResponse>(this.url, tokenRequest).pipe(
            tap(res => {
                let token = res && res.token;

                // if the token is there, login has been successful
                if (token) {
                    // store username and jwt token
                    this.setAuth(res);
                }
            })
        );
    }

    // performs the logout
    logout() {
        this.setAuth(null);
    }

    // Persist auth into localStorage or removes it if a NULL argument is given
    private setAuth(auth: TokenResponse) {
        if (auth) {
            localStorage.setItem(
                this.authKey,
                JSON.stringify(auth)
            );
        } else {
            localStorage.removeItem(this.authKey);
        }
    }

    // Retrieves the auth JSON object (or NULL if none)
    getAuth(): TokenResponse {
        let i = localStorage.getItem(this.authKey);

        if (i)
            return JSON.parse(i);
        
        return null;
    }

    // Returns the roles of the logged user
    getRoles(): string[] {
        let auth: any;
        let token: string;
        let decodedToken: any;
        let roles: string[];

        auth = this.getAuth();
        token = auth && auth.token;
        if (!token) return [];

        decodedToken = JSON.parse(
            atob(
                token.split('.')[1]
            )
        );
        
        roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        return roles || [];
    }

    // Returns the username of the logged user
    getUserEmail(): string {
        let auth = this.getAuth();
        let token: string;
        let decodedToken: any;

        token = auth && auth.token;
        if (!token) return null;

        decodedToken = JSON.parse(
            atob(
                token.split('.')[1]
            )
        );

        return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    }

    // Returns the userid of the logged user
    getUserId(): string {
        let auth = this.getAuth();
        let token: string;
        let decodedToken: any;

        token = auth && auth.token;

        decodedToken = JSON.parse(
            atob(
                token.split('.')[1]
            )
        );

        return decodedToken.sub;
    }

    // Returns TRUE if the user is logged in, FALSE otherwise
    isLoggedIn(): boolean {
        return localStorage.getItem(this.authKey) !== null;
    }

    // try to refresh token
    refreshToken(): Observable<TokenResponse> {
        let data = new TokenRequest();
        data.grant_type = 'refresh_token';
        data.refresh_token = this.getAuth()!.refresh_token;
        
        return this.login(data);
    }
}
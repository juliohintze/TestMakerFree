import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth-service";

@Injectable()

export class CanActivateDefault implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean {
        let logged = this.auth.isLoggedIn();

        if (logged) return true;
        else {
            this.router.navigate(['user/login']);
            return false;
        }
    }
}

@Injectable()

export class CanActivateAdmin implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean {
        let roles = this.auth.getRoles();

        if (roles.includes('Administrator')) {
            return true;
        } else {
            this.router.navigate(['user/login']);
            return false;
        }
    }
}
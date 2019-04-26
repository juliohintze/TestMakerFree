import { Component, EventEmitter, Output } from "@angular/core";
import { faHome, faSignInAlt, faInfoCircle, faPlusSquare, faSignOutAlt, faHistory, faThumbsUp, faUser, faUsers, faKey } from "@fortawesome/free-solid-svg-icons";
import { MenuService } from "src/app/services/menu-service";
import { AuthService } from "src/app/services/auth-service";

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})

export class NavMenuComponent {
    // Icons
    faHome = faHome;
    faLogin = faSignInAlt;
    faInfo = faInfoCircle;
    faPlus = faPlusSquare;
    faUser = faUser;
    faLogout = faSignOutAlt;
    faClock = faHistory;
    faLike = faThumbsUp;
    faUsers = faUsers;
    faPass = faKey;

    @Output() itemClick = new EventEmitter();

    constructor(private menuService: MenuService, private auth: AuthService) { }

    get menuOpened(): boolean {
        return this.menuService.state === 'open';
    }

    get isLoggedIn(): boolean {
        return this.auth.isLoggedIn();
    }

    get userEmail(): string {
        return this.auth.getUserEmail();
    }

    onItemClick() {
        this.itemClick.emit();
    }

    onLogout() {
        this.auth.logout();
        this.onItemClick();
    }
}
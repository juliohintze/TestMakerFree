import { Component, HostListener, OnInit } from "@angular/core";
import { OPEN_CLOSE_MENU, FADE_IN_OUT, OPEN_CLOSE_MENU_BODY } from "src/app/shared/animations";
import { MenuService } from "src/app/services/menu-service";
import { Subject } from "rxjs";
import { ResponsiveService } from "src/app/services/responsive-service";
import { AuthService } from "src/app/services/auth-service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        OPEN_CLOSE_MENU,
        OPEN_CLOSE_MENU_BODY,
        FADE_IN_OUT
    ]
})

export class HomeComponent implements OnInit {

    onMenuStartOpen = new Subject();
    isSideBySide = false;

    get menuState() {
        return this.menuService.state;
    }

    get bodyState() {
        return (this.menuState === 'open' && this.isSideBySide) ? 'sbs' : 'full';
    }

    sizeChanges(size: 'big' | 'small') {
        if (size === 'big' && !this.isSideBySide) {
            this.isSideBySide = true;
            this.openMenu();
        } 
        
        if (size === 'small' && this.isSideBySide) {
            this.isSideBySide = false;
            this.closeMenu();
        }
    }

    onMenuItemClick() {
        if (this.responsiveService.size === 'small')
            this.closeMenu();
    }

    openMenu() {
        this.menuService.toggle('open');
    }

    closeMenu() {
        this.menuService.toggle('closed');
    }

    ngOnInit() {
        if (window.innerWidth >= 900) this.sizeChanges('big');
        else this.sizeChanges('small');

        this.responsiveService.sizeChanges.subscribe(
            res => this.sizeChanges(res.size)
        )

        console.log(this.authService.getAuth().token);
    }

    constructor(private menuService: MenuService, 
                private responsiveService: ResponsiveService,
                private authService: AuthService) { }
}
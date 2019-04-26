import { Component } from "@angular/core";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { MenuService } from "src/app/services/menu-service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-nav-top',
    templateUrl: './nav-top.component.html',
    styleUrls: ['./nav-top.component.scss']
})

export class NavTopComponent {
    // Icons
    faBars = faBars;
    faSearch = faSearch;

    searchText: string;

    toggleMenu() {
        this.menuService.toggle();
    }

    onSubmit() {
        this.router.navigate(['quiz/all'], { queryParams: { query: this.searchText, page: 1 } })
    }

    constructor(private menuService: MenuService,
                private router: Router) {  }
}
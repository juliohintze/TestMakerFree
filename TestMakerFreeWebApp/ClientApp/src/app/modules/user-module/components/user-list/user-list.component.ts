import { Component, OnInit } from "@angular/core";
import { SearchResponse } from "src/app/models/search-response";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user-service";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute, Router, Params } from "@angular/router";

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {
    // Icons
    faSearch = faSearch;

    userSearch: SearchResponse<User>;
    paginationButtons: number[];
    state: 'loaded' | 'loading' | 'no-results' | 'error' = 'loading';

    searchQuery = '';
    searchHasQuery = false;
    currentPage = 1;

    get searchLength(): number {
        return this.userSearch ? this.userSearch.results.length : 0;
    }

    constructor(
        private userService: UserService, 
        private route: ActivatedRoute,
        private router: Router
    ) { }

    search() {
        this.changeQueryParams({
            'query': this.searchQuery,
            'page': 1
        });
    }
        
    goToPage(page: number) {
        this.currentPage = page;
        this.changeQueryParams({
            'page': page
        });
    }

    changeQueryParams(newParams: Params) {
        this.router.navigate(
            [], 
            {
              relativeTo: this.route,
              queryParams: newParams,
              queryParamsHandling: "merge"
            }
        );
    }

    ngOnInit() {
        this.route.queryParams.subscribe(
            params => {
                if (isFinite(+params['page']))
                    this.currentPage = +params['page'];

                this.state = 'loading';
                this.searchQuery = params['query'] || '';
                this.userService
                    .searchUsers(this.searchQuery, 10, this.currentPage).subscribe(
                        res => {
                            this.searchHasQuery = this.searchQuery !== '';
                            this.userSearch = res;
                            this.state = 'loaded';
                        },
                        err => {
                            this.state = 'error';
                            console.log(err);
                        }
                    )
            }
        )
    }
}
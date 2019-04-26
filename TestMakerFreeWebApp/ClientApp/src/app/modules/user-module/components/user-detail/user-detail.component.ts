import { Component } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { UserService } from "src/app/services/user-service";
import { User } from "src/app/models/user";
import { QuizService } from "src/app/services/quiz-service";
import { Quiz } from "src/app/models/quiz";
import { SearchResponse } from "src/app/models/search-response";
import { QuizSearchRequest } from "src/app/models/quiz-search";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})

export class UserDetailComponent {
    // Icons
    faSearch = faSearch;

    user: User;
    quizSearch: SearchResponse<Quiz>;
    totalQuizzes = -1;
    status: 'error' | 'loading' | 'loaded' = 'loading';

    currentPage = 1;
    resultsFiltered = false;
    searchQuery = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private quizService: QuizService
    ) { }
    
    changeQueryParams(newParams: Params) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: newParams,
            queryParamsHandling: "merge"
        });
    }

    onSearchSubmit() {
        this.changeQueryParams({
            'query': this.searchQuery,
            'page': 1
        });
    }

    searchQuizzes() {
        let search = new QuizSearchRequest();

        search.page = this.currentPage;
        search.userId = this.user.id;
        search.title = this.searchQuery;

        this.quizService.search(search).subscribe(
            res => {
                this.resultsFiltered = !!search.title;
                this.quizSearch = res;
            },
            err => {
                console.log(err);
            }
        )
    }

    goToPage(page: number) {
        this.currentPage = page;
        this.changeQueryParams({
            'page': page
        });
    }
    
    ngOnInit() {
        let userId = this.route.snapshot.params['id'];

        if (!userId) {
            this.status = 'error';
            return;
        }

        this.quizService.getQuizCount(userId).subscribe(
            num => this.totalQuizzes = num
        );
        
        this.userService.getUser(userId).subscribe(
            res => {
                this.user = res;
                this.status = 'loaded';

                this.route.queryParams.subscribe(
                    params => {
                        let page = +params['page'];
                        let query = params['query'];

                        if (isFinite(page) && page > 0)
                            this.currentPage = page;

                        if (query)
                            this.searchQuery = query;

                        this.searchQuizzes();
                    }
                );
            },
            err => {
                this.status = 'error';
                console.log(err);
            }
        )
    }
}
import { Component, Input, OnInit } from "@angular/core";
import { SearchResponse } from "src/app/models/search-response";
import { Quiz } from "src/app/models/quiz";
import { Params, Router, ActivatedRoute } from "@angular/router";
import { QuizService } from "src/app/services/quiz-service";
import { QuizSearchRequest } from "src/app/models/quiz-search";
import { Observable } from "rxjs";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-your-quizzes',
    templateUrl: './your-quizzes.component.html',
    styleUrls: ['./your-quizzes.component.scss']
})

export class YourQuizzesComponent implements OnInit {
    // Icons
    faSearch = faSearch;

    quizSearch: SearchResponse<Quiz>;
    
    title = '';
    state: 'loaded' | 'loading' | 'no-results' | 'error' = 'loading';
    searchQuery = '';
    resultsFiltered = false;
    currentPage = 1;

    getMethod: (request: QuizSearchRequest) =>
        Observable<SearchResponse<Quiz>>;


    constructor(private router: Router,
                private route: ActivatedRoute,
                private quizService: QuizService) { }

    changeQueryParams(newParams: Params) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: newParams,
            queryParamsHandling: 'merge'
        });
    }

    goToPage(page: number) {
        this.changeQueryParams({
            'page': page
        })
    }

    onSearchSubmit() {
        this.changeQueryParams({
            'query': this.searchQuery,
            'page': 1
        });
    }

    searchQuizzes() {
        let request = new QuizSearchRequest();

        let handleRes = (res: SearchResponse<Quiz>) => {
            this.quizSearch = res;
            this.resultsFiltered = !!request.title;
            this.state = 'loaded';
        }

        let handleErr = (err: any) => {
            console.log(err);
            this.state = 'error';
        }

        request.page = this.currentPage;
        request.title = this.searchQuery || null;
        
        this.state = 'loading';
        (this.getMethod.call(this.quizService, request) as Observable<SearchResponse<Quiz>>)
            .subscribe(handleRes, handleErr);
    }

    ngOnInit() {
        this.route.data.subscribe(
            data => {
                let getMethod = data['getMethod'];
                let title = data['title'];

                if (title) this.title = title;
                if (getMethod && this.quizService[getMethod]) {
                    this.getMethod = this.quizService[getMethod];
                    this.route.queryParams.subscribe(
                        params => {
                            let { page, query } = params;

                            this.searchQuery = query || '';
                            
                            if (isFinite(+page) && +page > 0)
                                this.currentPage = +page;

                            this.searchQuizzes();
                        }
                    )
                }
            }
        )
    }
}
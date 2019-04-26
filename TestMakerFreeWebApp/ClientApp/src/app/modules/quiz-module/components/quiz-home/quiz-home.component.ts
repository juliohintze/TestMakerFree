import { Component, OnInit } from "@angular/core";
import { Quiz } from "src/app/models/quiz";
import { QuizService } from "src/app/services/quiz-service";
import { faFireAlt, faSortAlphaDown, faClock, faUser, faThumbsUp, faHistory } from "@fortawesome/free-solid-svg-icons";
import { QuizSearchRequest } from "src/app/models/quiz-search";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { AuthService } from "src/app/services/auth-service";
import { SearchResponse } from "src/app/models/search-response";

@Component({
    selector: 'app-quiz-home',
    templateUrl: './quiz-home.component.html',
    styleUrls: ['./quiz-home.component.scss']
})

export class QuizHomeComponent implements OnInit {
    constructor(
        private quizService: QuizService, 
        private route: ActivatedRoute,
        private router: Router,
        private auth: AuthService
    ) { }

    // Icons
    faMostViewed = faFireAlt;
    faByTitle = faSortAlphaDown;
    faLatest = faClock;
    faUser = faUser;
    faLike = faThumbsUp;
    faClock = faHistory;

    quizSearch: SearchResponse<Quiz>;
    state: 'loaded' | 'loading' | 'no-results' | 'error' = 'loading';
    from: string;

    selectedList: 'byTitle' | 'latest' | 'mostViewed' = 'latest';
    searchQuery = '';
    currentPage = 1;

    getTitle(): string {
        let titles = {
            byTitle: 'Quizzes by title',
            latest: 'Latest quizzes',
            mostViewed: 'Most viewed quizzes'
        }

        if (this.from) {
            if (this.from === 'taken')
                return 'Taken quizzes';

            if (this.from === 'liked')
                return 'Liked quizzes';

            if (this.from === 'made')
                return 'Made quizzes';
        }

        if (this.searchQuery)
            return `Search result for ${this.searchQuery}`;
        else
            return titles[this.selectedList];
    }

    changeQueryParams(newParams: Params) {
        this.router.navigate(
            [], 
            {
              relativeTo: this.route,
              queryParams: newParams,
              queryParamsHandling: "merge"
            });
    }

    onListSelect(newList) {
        if (this.selectedList !== newList) {
            this.changeQueryParams({
                'order': newList,
                'from': '',
                'page': 1
            });
        }
    }

    goToPage(num: number) {
        this.changeQueryParams({'page': num});
    }

    searchQuizzes() {
        let request = new QuizSearchRequest();

        let handleRes = (res: SearchResponse<Quiz>) => {
            this.quizSearch = res;
            
            if (res.totalResults === 0)
                this.state = 'no-results';
            else
                this.state = 'loaded';
        }
        let handleErr = (err: any) => {
            console.log(err);
            this.state = 'error';
        }

        request.page = this.currentPage;
        request.title = this.searchQuery || null;
        request.orderBy = this.selectedList;
        
        this.state = 'loading';
        if (this.from === 'taken') {
            this.quizService.getTakenQuizzes(request).subscribe(handleRes, handleErr);
        } else if (this.from === 'liked') {
            this.quizService.getLikedQuizzes(request).subscribe(handleRes, handleErr);
        } else if (this.from === 'self') {
            request.userId = this.auth.getUserId();
            this.quizService.search(request).subscribe(handleRes, handleErr);
        } else {
            this.quizService.search(request).subscribe(handleRes, handleErr);
        }
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            if (!data.from) return;

            this.from = data.from;
        });

        this.route.queryParams.subscribe(res => {
            let { page, query, order } = res;

            if (isFinite(+page) && +page > 0)
                this.currentPage = +page;

            if (order && order.search(/latest|byTitle|mostViewed/) > -1) {
                this.selectedList = order;
            }

            this.searchQuery = query || '';

            this.searchQuizzes();
        });
    }
}
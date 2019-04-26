import { Component, OnInit } from "@angular/core";
import { Quiz } from "src/app/models/quiz";
import { QuizService } from "src/app/services/quiz-service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Question } from "src/app/models/question";
import { QuestionService } from "src/app/services/question-service";
import { ResultService } from "src/app/services/result-service";
import { Result } from "src/app/models/result";
import { QuizSearchRequest } from "src/app/models/quiz-search";
import { map } from "rxjs/operators";
import { faTrashAlt, faClone, faThumbsUp, faClipboardList, faEdit, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "src/app/services/auth-service";

@Component({
    selector: 'app-quiz-detail',
    templateUrl: './quiz-detail.component.html',
    styleUrls: ['./quiz-detail.component.scss']
})

export class QuizDetailComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private quizService: QuizService,
        private questionService: QuestionService,
        private resultService: ResultService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) { }

    // Icons
    faTrash = faTrashAlt;
    faClone = faClone;
    faLike = faThumbsUp;
    faClipboard = faClipboardList;
    faEdit = faEdit;
    faCaretLeft = faCaretLeft;

    quiz: Quiz;
    questions: Question[];
    results: Result[];
    state: 'ready' | 'loading' | 'notFound';

    get userIsMaker(): boolean {
        let userId = this.authService.getUserId();

        return userId === this.quiz.userId;
    }

    get userIsAdmin(): boolean {
        let roles = this.authService.getRoles();

        return roles.includes('Administrator');
    }

    ngOnInit() {
        let id = +this.route.snapshot.paramMap.get('id');

        if (isNaN(id)) {
            this.state = 'notFound';
            return;
        }

        this.state = 'loading';
        this.quizService.getQuiz(id)
            .subscribe(
                result => {
                    this.quiz = result;
                    this.state = 'ready';
                    
                    this.questionService.getQuestions(id).subscribe(
                        result => this.questions = result,
                        error => console.log(error)
                    );
                    this.resultService.getResults(id).subscribe(
                        res => this.results = res,
                        err => console.log(err)
                    )
                },
                error => {
                    console.log(error);
                    this.state = 'notFound';
                }
            );

    }

    onEdit() {
        this.router.navigate(['/quiz/edit', this.quiz.id]);
    }

    onDelete() {
        let confirmation = confirm('Are you sure you want to delete this quiz?');

        if (confirmation) {
            this.quizService.deleteQuiz(this.quiz.id).subscribe(
                res => {
                    console.log(`Quiz with ID ${this.quiz.id} deleted.`);
                    this.onBack();
                },
                error => console.log(error)
            )
        }
    }

    onTake() {
        this.router.navigate(['/quiz/take', this.quiz.id]);
    }

    onLike() {
        this.quizService.likeQuiz(this.quiz).subscribe(
            res => this.quiz = res,
            err => console.log(err)
        )
    }

    onBack() {
        this.location.back();
    }
}
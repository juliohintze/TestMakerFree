import { Component, OnInit } from "@angular/core";
import { Quiz } from "src/app/models/quiz";
import { Question } from "src/app/models/question";
import { QuizService } from "src/app/services/quiz-service";
import { ActivatedRoute } from "@angular/router";
import { Answer } from "src/app/models/answer";
import { faCircle, faCheckCircle, faThumbsUp, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { Result } from "src/app/models/result";
import { Location } from "@angular/common";

@Component({
    selector: 'app-quiz-take',
    templateUrl: 'quiz-take.component.html',
    styleUrls: ['./quiz-take.component.scss']
})

export class QuizTakeComponent implements OnInit {
    constructor(private quizService: QuizService,
                private route: ActivatedRoute,
                private location: Location) { }

    // Icons
    faCircle = faCircle;
    faCheckCircle = faCheckCircle;
    faLike = faThumbsUp;
    faCaretLeft = faCaretLeft;

    quiz: Quiz;
    currentQuestion: Question;
    selectedAnswer: Answer;
    previousAnswers: Answer[] = [];
    state: 'loading' | 'loaded' | 'error' = 'loading';
    result: Result;

    get currentQuestionIndex(): number {
        return this.quiz.questions.indexOf(this.currentQuestion);
    }

    get currentQuestionNumber(): number {
        return this.currentQuestionIndex + 1;
    }

    get canNext(): boolean {
        let num = this.currentQuestionNumber;

        if (num === 0 || num === this.quiz.questions.length || !this.selectedAnswer)
            return false;
        else
            return true;
    }

    get canPrev(): boolean {
        let num = this.currentQuestionNumber;

        return num > 1;
    }

    selectAnswer(answer: Answer) {
        this.selectedAnswer = answer;
    }

    nextQuestion() {
        let idx: number;

        // if (!this.canNext) return;

        idx = this.currentQuestionIndex;
        this.currentQuestion = this.quiz.questions[idx + 1];
        this.addAnswerToArray(this.selectedAnswer);
        this.selectedAnswer = null;
    }

    prevQuestion() {
        let idx: number;

        if (!this.canPrev) return;

        idx = this.currentQuestionIndex;
        this.currentQuestion = this.quiz.questions[idx - 1];
        this.selectedAnswer = this.previousAnswers.pop();
    }

    calculateResult() {
        let possibleResults: Result[] = [];

        this.addAnswerToArray(this.selectedAnswer);
        
        this.previousAnswers.forEach(a => {
            let result = this.quiz.results.find(r => r.id === a.relatedResultId);

            if (!possibleResults.includes(result)) {
                result.count = 1;
                possibleResults.push(result);
            } else {
                result.count++;
            }
        });

        possibleResults.sort((a, b) => {
            let diffCount = b.count - a.count;
            let diffPrior = a.priority - b.priority;

            if (diffCount !== 0) return diffCount;
            else return diffPrior;
        });

        this.result = possibleResults[0];
        this.complete();
    }

    addAnswerToArray(answer: Answer) {
        this.previousAnswers.push(answer);
    }

    onLike() {
        this.quizService.likeQuiz(this.quiz).subscribe(
            res => {
                this.quiz.likeCount = res.likeCount;
                this.quiz.liked = res.liked;
            },
            err => console.log(err)
        )
    }

    complete() {
        this.quizService.takeQuiz(this.quiz).subscribe(
            res => { },
            err => console.log(err)
        )
    }

    onBack() {
        this.location.back();
    }

    ngOnInit() {
        let id = +this.route.snapshot.params['id'];

        if (isFinite(id)) {
            this.quizService.getQuiz(id, true).subscribe(
                res => {
                    this.quiz = res;
                    this.currentQuestion = res.questions[0];
                    this.state = 'loaded';
                },
                err => {
                    console.log(err);
                    this.state = 'error';
                }
            )

        } else {
            this.state = 'error';
        }
    }
}
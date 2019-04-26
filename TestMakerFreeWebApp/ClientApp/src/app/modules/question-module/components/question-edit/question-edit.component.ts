import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Quiz } from "src/app/models/quiz";
import { QuizService } from "src/app/services/quiz-service";
import { QuestionService } from "src/app/services/question-service";
import { Question } from "src/app/models/question";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { QUESTION_EDIT_TABS } from "src/app/enums/tabs";
import { FormComponent } from "src/app/interfaces/form-component.interface";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-question-edit',
    templateUrl: './question-edit.component.html',
    styleUrls: ['./question-edit.component.scss']
})

export class QuestionEditComponent implements OnInit, FormComponent {
    // Icons
    faSave = faSave;
    faTimes = faTimes;

    form: FormGroup;
    quiz: Quiz;
    editMode: boolean;
    question: Question;
    currentTab = 0; // 0 = question; 1 = answers
    state: 'loading' | 'loaded' | 'error' = 'loading';

    constructor(private quizService: QuizService,
                private questionService: QuestionService,
                private route: ActivatedRoute,
                private router: Router,
                private fb: FormBuilder) { }

    ngOnInit() {
        let questionId = +this.route.snapshot.params['id'],
            quizId = +this.route.snapshot.params['quizId'];

        let onGetQuestion = (res: Question) => {
            this.question = res;
            this.updateForm();
            this.quizService.getQuiz(res.quizId)
                .subscribe(onGetQuiz, onError);

            this.route.queryParams.subscribe(params => {
                this.onTabChange(params.tab);
            });

            this.state = 'loaded';
        }

        let onGetQuiz = (res: Quiz) => {
            this.quiz = res;
        }

        let onError = (err: any) => {
            console.log(err);
            this.state = 'error';
        }

        this.editMode = isFinite(questionId);
        this.createForm();

        if (this.editMode) {
            this.questionService.getQuestion(questionId)
                .subscribe(onGetQuestion, onError);
        } else {
            this.question = new Question();
            this.question.quizId = quizId;
            this.question.text = '**Question title**';

            this.quizService.getQuiz(quizId)
                .subscribe(onGetQuiz, onError);

            this.questionService.createQuestion(this.question)
                .subscribe(onGetQuestion, onError);
        }
    }

    onSave() {
        this.question.text = this.form.value.text;

        this.questionService.editQuestion(this.question).subscribe(
            res => {
                console.log(`Question ID ${res.id} has been updated!`);
                this.onBack();
            },
            err => console.log(err)
        );
    }

    onBack() {
        this.router.navigate([`quiz/edit/${this.quiz.id}`], { queryParams: { tab: 'questions' } });
    }

    onCancel() {
        this.questionService.deleteQuestion(this.question.id).subscribe(
            res => {
                this.onBack();
            },
            err => {
                console.log(err);
                this.onBack();
            }
        )
    }

    onTabChange(newTab: string) {
        let tabNumber = QUESTION_EDIT_TABS[newTab] || 0;

        this.currentTab = tabNumber;
    }

    isTab(tabIndex: number): boolean {
        return tabIndex === this.currentTab;
    }

    getFormControl(name: string): AbstractControl {
        return this.form.get(name);
    }

    hasError(name: string): boolean {
        let e = this.getFormControl(name);
        return e && e.touched && !e.valid;
    }

    createForm() {
        this.form = this.fb.group({
            text: ['', Validators.required]
        })
    }

    updateForm() {
        this.form.setValue({
            text: this.question.text
        })
    }
}
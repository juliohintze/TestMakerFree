import { Component, OnInit } from "@angular/core";
import { faSave, faTimes, faCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Question } from "src/app/models/question";
import { Answer } from "src/app/models/answer";
import { QuestionService } from "src/app/services/question-service";
import { AnswerService } from "src/app/services/answer-service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { FormComponent } from "src/app/interfaces/form-component.interface";
import { Result } from "src/app/models/result";
import { ResultService } from "src/app/services/result-service";

@Component({
    selector: 'app-answer-edit',
    templateUrl: './answer-edit.component.html',
    styleUrls: ['./answer-edit.component.scss']
})

export class AnswerEditComponent implements OnInit, FormComponent {
    // Icons
    faSave = faSave;
    faTimes = faTimes;
    faCircle = faCircle;
    faCheckCircle = faCheckCircle;

    form: FormGroup;
    question: Question;
    answer: Answer;
    results: Result[];
    editMode: boolean;
    state: 'loading' | 'loaded' | 'error' = 'loading';

    constructor(private questionService: QuestionService,
                private resultService: ResultService,
                private answerService: AnswerService,
                private route: ActivatedRoute,
                private router: Router,
                private fb: FormBuilder) { }

    getRelatedResultId(): number {
        return +this.form.value.relatedResultId || -1;
    }

    ngOnInit() {
        let questionId = +this.route.snapshot.params['questionId'];
        let answerId = +this.route.snapshot.params['id'];

        let onGetAnswer = (res: Answer) => {
            this.answer = res;
            this.updateForm();
            this.questionService.getQuestion(res.questionId)
                .subscribe(
                    res => {
                        this.question = res;
                        this.resultService.getResults(res.quizId).subscribe(
                            res => this.results = res,
                            err => console.log(err)
                        )
                    },
                    err => console.log(err)
                );
            this.state = 'loaded';
        }

        let onError = (err: any) => {
            console.log(err);
            this.state = 'error';
        }

        this.editMode = isFinite(answerId);
        this.createForm();

        if (this.editMode) {
            this.answerService.getAnswer(answerId)
                .subscribe(onGetAnswer, onError)
        } else {
            this.answer = new Answer();
            this.answer.questionId = questionId;
            this.answer.text = '**Answer text**';

            this.answerService.createAnswer(this.answer)
                .subscribe(onGetAnswer, onError);
        }
    }

    onSave() {
        this.answer.text = this.form.value.text;
        this.answer.relatedResultId = +this.form.value.relatedResultId || null;
        
        this.answerService.updateAnswer(this.answer)
            .subscribe(
                res => {
                    console.log(`Answer ID ${res.id} has been updated`);
                    this.onBack();
                },
                err => console.log(err)
            );
    }

    onBack() {
        this.router.navigate([`question/edit/${this.question.id}`], { queryParams: { tab: 'answers' } });
    }

    onCancel() {
        this.answerService.deleteAnswer(this.answer.id).subscribe(
            () => this.onBack(),
            err => console.log(err)
        )
    }

    onResultClick(result: Result) {
        this.form.patchValue({
            relatedResultId: result.id
        });
    }

    createForm() {
        this.form = this.fb.group({
            text: ['', Validators.required],
            relatedResultId: ['']
        });
    }

    updateForm() {
        this.form.setValue({
            text: this.answer.text,
            relatedResultId: this.answer.relatedResultId || ''
        })
    }

    getFormControl(name: string): AbstractControl {
        return this.form.get(name);
    }

    hasError(name: string): boolean {
        let e = this.getFormControl(name);
        return e && e.touched && !e.valid;
    }
}
import { Component, OnInit } from "@angular/core";
import { faTimes, faSave } from "@fortawesome/free-solid-svg-icons";
import { Quiz } from "src/app/models/quiz";
import { Result } from "src/app/models/result";
import { ResultService } from "src/app/services/result-service";
import { QuizService } from "src/app/services/quiz-service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormComponent } from "src/app/interfaces/form-component.interface";
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";

@Component({
    selector: 'app-result-edit',
    templateUrl: './result-edit.component.html',
    styleUrls: ['./result-edit.component.scss']
})

export class ResultEditComponent implements OnInit, FormComponent {
    // Icons
    faSave = faSave;
    faTimes = faTimes;

    form: FormGroup;
    quiz: Quiz;
    result: Result;
    editMode: boolean;

    constructor(private resultService: ResultService,
                private quizService: QuizService,
                private router: Router,
                private route: ActivatedRoute,
                private fb: FormBuilder) { }

    onSave() {
        let formValue = this.form.value;
        let result = this.result;
        let { text } = formValue;

        result.text = text;

        if (this.editMode) {
            this.resultService.updateResult(result)
                .subscribe(
                    res => {
                        console.log(`Result ID ${result.id} has been updated`);
                        this.onBack();
                    },
                    err => console.log(err)
                );
        } else {
            this.resultService.createResult(result)
                .subscribe(
                    res => {
                        console.log(`Result ID ${result.id} has been created`);
                        this.onBack();
                    },
                    err => console.log(err)
                )
        }
    }

    onBack() {
        this.router.navigate([`quiz/edit/${this.quiz.id}`], { queryParams: { tab: 'results' } });
    }

    ngOnInit() {
        let quizId = +this.route.snapshot.params['quizId'];
        let resultId = +this.route.snapshot.params['id'];

        this.editMode = isFinite(resultId);
        this.createForm();

        if (this.editMode) {
            this.resultService.getResult(resultId)
                .subscribe(
                    res => {
                        this.result = res;
                        this.updateForm();
                        this.quizService.getQuiz(res.quizId)
                            .subscribe(
                                res => this.quiz = res,
                                err => console.log(err)
                            );
                    },
                    err => console.log(err)
                );
        } else {
            this.quizService.getQuiz(quizId)
                .subscribe(
                    res => {
                        this.quiz = res;
                        this.result = new Result();
                        this.result.quizId = res.id;
                    },
                    err => console.log(err)
                )
        }
    }

    createForm() {
        this.form = this.fb.group({
            text: ['', Validators.required]
        });

        (window as any).c = this.form;
    }

    updateForm() {
        this.form.setValue({
            text: this.result.text
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
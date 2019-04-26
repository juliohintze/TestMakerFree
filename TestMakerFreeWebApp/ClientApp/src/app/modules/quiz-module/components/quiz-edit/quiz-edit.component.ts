import { Component, OnInit } from "@angular/core";
import { faSave, faEdit, faTrashAlt, faPlusSquare, faTimes, faSquare, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute, Router } from "@angular/router";
import { Quiz } from "src/app/models/quiz";
import { QuizService } from "src/app/services/quiz-service";
import { Subject } from "rxjs";
import { QUIZ_EDIT_TABS } from "src/app/enums/tabs";
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from "@angular/forms";
import { FormComponent } from "src/app/interfaces/form-component.interface";
import { Location } from "@angular/common";

@Component({
    selector: 'app-quiz-edit',
    templateUrl: './quiz-edit.component.html',
    styleUrls: ['./quiz-edit.component.scss']
})

// Component used to create or edit a quiz.
export class QuizEditComponent implements OnInit, FormComponent {
    // Icons
    faSave = faSave;
    faEdit = faEdit;
    faTrash = faTrashAlt;
    faPlus = faPlusSquare;
    faTimes = faTimes;
    faSquare = faSquare;
    faCheck = faCheckSquare;

    title: string;
    editMode: boolean;
    quiz: Quiz;
    currentTab = 0; // 0 = quiz; 1 = questions; 2 = results
    onSave: Subject<Quiz>;
    form: FormGroup;
    publishing = false;

    state: 'loading' | 'loaded' | 'error' = 'loading';

    constructor(
        private route: ActivatedRoute,
        private quizService: QuizService,
        private router: Router,
        private fb: FormBuilder,
        private location: Location
    ) { }

    onChangeTab(newTab: string) {
        let tabNumber = QUIZ_EDIT_TABS[newTab] || 0;
        this.currentTab = tabNumber;
    }

    isTab(tabIndex: number) {
        return tabIndex === this.currentTab;
    }

    onSubmit() {
        let q = this.quiz;
        let f = this.form.value;

        q.title = f.title;
        q.description = f.description;

        this.quizService.updateQuiz(this.quiz).subscribe(
            res => {
                console.log(`Quiz ID ${res.id} has been saved.`);
                this.router.navigate(['quiz/made']);
            },
            err => console.log(err)
        );
    }

    createForm() {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: ['']
        });
    }

    updateForm() {
        this.form.setValue({
            title: this.quiz.title,
            description: this.quiz.description || '',
        });
    }

    getFormControl(name: string): AbstractControl {
        return this.form.get(name);
    }

    hasError(name: string): boolean {
        let e = this.getFormControl(name);
        return e && e.touched && !e.valid;
    }

    onCancel() {
        this.quizService.deleteQuiz(this.quiz.id)
            .subscribe(() => this.location.back());
    }

    togglePublish() {
        this.publishing = true;
        this.quizService.togglePublish(this.quiz.id)
            .subscribe(
                quiz => {
                    this.publishing = false;
                    this.quiz.published = quiz.published;
                },
                err => {
                    this.publishing = false;
                    console.log(err);
                }
            )
    }

    ngOnInit() {
        let id = +this.route.snapshot.params['id'];

        let onGet = (res: Quiz) => {
            this.quiz = res;
            this.updateForm();
            this.route.queryParams
                .subscribe(params => {
                    this.onChangeTab(params.tab);
                })
            this.state = 'loaded';
        }

        let onError = (err: any) => {
            console.log(err);
            this.state = 'error';
        }

        this.createForm();
        this.editMode = isFinite(id);

        if (this.editMode) {
            this.title = 'Edit quiz';
            this.quizService.getQuiz(id).subscribe(onGet, onError);
        } else {
            this.title = 'Creating quiz';
            this.quiz = new Quiz();

            this.quiz.title = 'Untitled quiz';
            this.quizService.createQuiz(this.quiz)
                .subscribe(onGet, onError);
        }

        this.onSave = new Subject<Quiz>();
    }
}
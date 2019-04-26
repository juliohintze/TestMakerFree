import { Component, Input, OnInit } from "@angular/core";
import { Quiz } from "src/app/models/quiz";
import { Question } from "src/app/models/question";
import { faEdit, faTrashAlt, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { QuestionService } from "src/app/services/question-service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
})

export class QuestionListComponent implements OnInit {
    // Icons
    faEdit = faEdit;
    faTrash = faTrashAlt;
    faPlus = faPlusSquare;

    @Input() quiz: Quiz;
    questions: Question[];

    constructor(
        private questionService: QuestionService,
        private router: Router) { }

    ngOnInit() {
        this.questionService.getQuestions(this.quiz.id).subscribe(
            res => this.questions = res,
            err => console.log(err)
        )
    }

    onCreateQuestion() {
        this.router.navigate([`question/create/${this.quiz.id}`]);
    }

    onEditQuestion(question: Question) {
        this.router.navigate([`question/edit/${question.id}`]);
    }

    onDeleteQuestion(question: Question) {
        this.questionService.deleteQuestion(question.id).subscribe(
            res => {
                let idx = this.questions.indexOf(question);

                this.questions.splice(idx, 1);
            },
            err => console.log(err)
        )
    }
}
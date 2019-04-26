import { Component, Input, OnInit } from "@angular/core";
import { Question } from "src/app/models/question";
import { Answer } from "src/app/models/answer";
import { faEdit, faTrashAlt, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { AnswerService } from "src/app/services/answer-service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-answer-list',
    templateUrl: './answer-list.component.html',
    styleUrls: ['./answer-list.component.scss']
})

export class AnswerListComponent implements OnInit {
    // Icons
    faEdit = faEdit;
    faTrash = faTrashAlt;
    faPlus = faPlusSquare;

    @Input() question: Question;

    answers: Answer[];

    constructor(private answerService: AnswerService,
        private router: Router) { }

    onAnswerEdit(answer: Answer) {
        this.router.navigate([`answer/edit/${answer.id}`]);
    }

    onAnswerDelete(answer: Answer) {
        this.answerService.deleteAnswer(answer.id)
            .subscribe(
                res => {
                    let idx = this.answers.indexOf(answer);

                    this.answers.splice(idx, 1);
                },
                err => console.log(err)
            )
    }

    onAnswerCreate() {
        this.router.navigate([`answer/create/${this.question.id}`]);
    }

    ngOnInit() {
        this.answerService.getAnswers(this.question.id)
            .subscribe(
                res => this.answers = res,
                err => console.log(err)
            )
    }
}
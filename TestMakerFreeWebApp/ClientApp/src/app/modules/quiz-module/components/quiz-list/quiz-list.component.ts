import { Component, Input } from "@angular/core";
import { Quiz } from "src/app/models/quiz";

@Component({
    selector: 'app-quiz-list',
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.scss']
})

export class QuizListComponent {
    @Input('list') list: Quiz[];
}
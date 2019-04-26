import { Component, Input, OnInit } from "@angular/core";
import { Quiz } from "src/app/models/quiz";
import { Result } from "src/app/models/result";
import { ResultService } from "src/app/services/result-service";
import { Router } from "@angular/router";
import { faPlusSquare, faTrashAlt, faEdit, faGripLines } from "@fortawesome/free-solid-svg-icons";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
    selector: 'app-result-list',
    templateUrl: './result-list.component.html',
    styleUrls: ['./result-list.component.scss']
})

export class ResultListComponent implements OnInit {
    // Icons
    faPlus = faPlusSquare;
    faTrash = faTrashAlt;
    faEdit = faEdit;
    faGrip = faGripLines;

    @Input() quiz: Quiz;

    results: Result[];
    disableDrag = false;

    constructor(private resultService: ResultService,
                private router: Router) { }

    ngOnInit() {
        this.resultService.getResults(this.quiz.id)
            .subscribe(
                res => this.results = res,
                err => console.log(err)
            )
    }

    onResultEdit(result: Result) {
        this.router.navigate([`result/edit/${result.id}`]);
    }

    onResultCreate() {
        this.router.navigate([`result/create/${this.quiz.id}`]);
    }

    onResultDelete(result: Result) {
        this.resultService.deleteResult(result.id).subscribe(
            res => {
                let idx = this.results.indexOf(result);

                this.results.splice(idx, 1);
            },
            err => console.log(err)
        )
    }

    onDrop(event: CdkDragDrop<Result[]>) {
        let newPr = event.currentIndex + 1;
        let result = this.results[event.previousIndex];

        moveItemInArray(this.results, event.previousIndex, event.currentIndex);

        result.priority = newPr;
        this.disableDrag = true;
        this.resultService.changePriority(result).subscribe(
            res => {
                this.results = res;
                this.disableDrag = false;
            },
            err => {
                moveItemInArray(this.results, event.currentIndex, event.previousIndex);
                console.log(err);
                this.disableDrag = false;
            }
        )
    }
}
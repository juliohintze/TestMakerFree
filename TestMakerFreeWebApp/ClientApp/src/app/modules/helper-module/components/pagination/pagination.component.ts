import { Component, Input, EventEmitter, Output, HostListener, OnInit } from "@angular/core";
import { ResponsiveService } from "src/app/services/responsive-service";

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent {
    // Private properties
    private _paginationButtons: number[] = [];
    private _currentPage = 1;
    private _lastPage = 1;
    private _maxButtons = 5;

    // Public properties

    // Input properties
    @Input('current-page') set currentPage(value: number) {
        this._currentPage = value;
        this.calculateButtons();
    }
    @Input('last-page') set lastPage(value: number) {
        this._lastPage = value;
        this.calculateButtons();
    }
    @Input('max-buttons') set maxButtons(value: number) {
        this._maxButtons = value;
        this.calculateButtons();
    }

    // get/set properties
    get paginationButtons(): number[] {
        return this._paginationButtons;
    }

    get currentPage(): number {
        return this._currentPage;
    }

    get lastPage(): number {
        return this._lastPage;
    }

    get large(): boolean {
        return this.responsiveService.size === 'big';
    }

    // Events
    @Output() pageChange = new EventEmitter<number>();

    // Public methods
    onButtonClick(page: number) {
        this.pageChange.emit(page);
    }

    // Private methods
    private calculateButtons(): number[] {
        let numbers = [this._currentPage];
        let number: number;
        let insertAt: 'before' | 'after' = 'after';

        if (!(this._maxButtons <= 1 || this._lastPage <= 1)) {
            while (numbers.length !== this._maxButtons && numbers.length !== this._lastPage) {
                if (insertAt === 'before') {
                    number = numbers[0] - 1;
    
                    if (number > 0) numbers.unshift(number);
    
                    insertAt = 'after';
                } else {
                    number = numbers[numbers.length - 1] + 1;
    
                    if (number <= this._lastPage) numbers.push(number);
    
                    insertAt = 'before';
                }
            }
        }


        this._paginationButtons = numbers;
        return numbers;
    }

    // Constructor
    constructor(private responsiveService: ResponsiveService) { }

}
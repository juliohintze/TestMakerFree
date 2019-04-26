import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

type size = 'small' | 'big';

type sizeChangesResponse = {
    size: size, 
    firstChange: boolean
};

@Injectable({
    providedIn: 'root'
})

export class ResponsiveService {
    // Private properties
    private _firstChange = true;
    private _size: size;
    private _sizeChanges = new Subject<sizeChangesResponse>();

    // Public properties
    sizeChanges: Observable<sizeChangesResponse>;

    get size(): size {
        return this._size;
    }
    set size(value: size) {
        if (this._size !== value) {
            this._size = value;
            this._sizeChanges.next({ size: value, firstChange: this._firstChange });
            this._firstChange = false;
        }
    }

    constructor() {
        this.sizeChanges = this._sizeChanges.asObservable();
    }
}
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class MenuService {
    private _onStateChange = new Subject<MenuState>();

    onStateChange = this._onStateChange.asObservable();
    state: MenuState = 'closed';

    toggle(newState: MenuState = null) {
        if (newState) {
            this.state = newState
        } else {
            if (this.state === 'open')
                this.state = 'closed';
            else
                this.state = 'open';
        }
        
        this._onStateChange.next(this.state);
    }
}

type MenuState = 'open' | 'closed';
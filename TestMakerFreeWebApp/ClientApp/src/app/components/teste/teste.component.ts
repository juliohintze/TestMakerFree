import { Component } from "@angular/core";

@Component({
    selector: 'app-teste',
    templateUrl: './teste.component.html'
})

export class TesteComponent {
    numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    remover(num: number) {
        this.numeros.splice(this.numeros.indexOf(num), 1);
    }
}
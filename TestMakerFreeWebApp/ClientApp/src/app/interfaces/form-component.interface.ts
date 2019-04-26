import { AbstractControl } from "@angular/forms";

export interface FormComponent {
    getFormControl(name: string): AbstractControl;
    // isValid(name: string): boolean;
    // isChanged(name: string): boolean;
    hasError(name: string): boolean;
    createForm(): void;
    updateForm(): void;
}
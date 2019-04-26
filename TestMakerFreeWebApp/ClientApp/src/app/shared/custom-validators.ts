import { ValidatorFn, AbstractControl, FormGroup, FormArray } from "@angular/forms";

export function CompareToControl(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        let parent: FormGroup | FormArray;
        let sameValue: boolean;

        do {
            parent = control.parent;
        } while (parent && !(parent instanceof FormGroup));

        if (!parent) return null;

        sameValue = parent.get(controlName).value === control.value;
        return sameValue ? null : { 'differentValue': { value: control.value } };
    };
}
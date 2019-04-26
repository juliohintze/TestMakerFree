import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { CompareToControl } from "src/app/shared/custom-validators";
import { FormComponent } from "src/app/interfaces/form-component.interface";
import { UserService } from "src/app/services/user-service";
import { ChangePassword } from "src/app/models/change-password";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit, FormComponent {
    form: FormGroup;
    state: 'error' | 'success' | 'stand-by' | 'loading' = 'stand-by';

    constructor(private fb: FormBuilder,
                private userService: UserService) { }

    getButtonText(): string {
        switch(this.state) {
            case 'loading':
                return 'Loading...';

            case 'success':
                return 'Password changed!'

            default:
                return 'Submit';
        }
    }
            
    createForm() {
        let untouch = () => this.form.get('confirmPassword').markAsUntouched();

        this.form = this.fb.group({
            'oldPassword':     ['', Validators.required],
            'newPassword':     ['', [Validators.required, Validators.minLength(6)]],
            'confirmPassword': ['', [Validators.required, CompareToControl('newPassword')]]
        });

        this.form.valueChanges.subscribe(
            () => this.state = 'stand-by'
        );
        this.form.get('confirmPassword').valueChanges.subscribe(
            () => untouch()
        );
        this.form.get('newPassword').valueChanges.subscribe(
            () => untouch()
        );
    }

    updateForm() {
        // do nothing
        return;
    }

    getFormControl(name: string): AbstractControl {
        return this.form.get(name);
    }

    hasError(name: string): boolean {
        let e = this.getFormControl(name);
        return e && e.touched && !e.valid;
    }

    ngOnInit() {
        this.createForm();
    }

    onSubmit() {
        let formValue = this.form.value;
        let changePassword: ChangePassword = {
            oldPassword: formValue.oldPassword,
            newPassword: formValue.newPassword
        };

        this.state = 'loading';
        this.userService.changePassword(changePassword).subscribe(
            changed => {
                if (changed) this.state = 'success';
                else this.state = 'error';
            }
        )
    }
}
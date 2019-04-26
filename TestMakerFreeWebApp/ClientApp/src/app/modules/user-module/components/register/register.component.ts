import { Component, OnInit } from "@angular/core";
import { FormComponent } from "src/app/interfaces/form-component.interface";
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from "@angular/forms";
import { CompareToControl } from "src/app/shared/custom-validators";
import { UserService } from "src/app/services/user-service";
import { Register } from "src/app/models/register";
import { Router } from "@angular/router";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit, FormComponent {
    form: FormGroup;

    createForm() {
        let untouch = () => this.form.get('confirmPassword').markAsUntouched();

        this.form = this.fb.group({
            username: ['', Validators.required],
            displayName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', CompareToControl('password')]
        });

        this.form.get('confirmPassword').valueChanges.subscribe(
            () => untouch()
        );
        this.form.get('password').valueChanges.subscribe(
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
        let register: Register = {
            username: formValue.username,
            password: formValue.password,
            email: formValue.email,
            displayName: formValue.displayName
        };

        this.userService.createUser(register).subscribe(
            res => this.router.navigate(['user/login']),
            err => console.log(err)
        );
    }

    constructor(private fb: FormBuilder, 
                private userService: UserService,
                private router: Router) { }
}
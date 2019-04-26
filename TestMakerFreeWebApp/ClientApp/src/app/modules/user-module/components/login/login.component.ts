import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth-service";
import { FormGroup, FormBuilder, AbstractControl, Validators } from "@angular/forms";
import { FormComponent } from "src/app/interfaces/form-component.interface";
import { TokenRequest } from "src/app/models/token-request";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, FormComponent {
    constructor(private authService: AuthService,
                private fb: FormBuilder,
                private router: Router) { }

    form: FormGroup;
    tokenRequest: TokenRequest;
    wrongCredentials = false;
    
    createForm() {
        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.form.valueChanges.subscribe(
            res => this.wrongCredentials = false
        )
    }

    updateForm() {
        this.form.setValue({
            username: this.tokenRequest.username,
            password: this.tokenRequest.password
        });
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
        this.tokenRequest = new TokenRequest();
    }

    onSubmit() {
        this.tokenRequest.username = this.form.value.username;
        this.tokenRequest.password = this.form.value.password;
        
        this.authService.login(this.tokenRequest).subscribe(
            () => this.router.navigate(['quiz/all']),
            err => {
                this.wrongCredentials = true;
                console.log(err);
            }
        )
    }
}
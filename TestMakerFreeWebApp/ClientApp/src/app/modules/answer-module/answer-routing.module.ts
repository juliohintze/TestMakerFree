import { RouterModule, Route } from "@angular/router";
import { NgModule } from "@angular/core";
import { AnswerEditComponent } from "./components/answer-edit/answer-edit.component";
import { CanActivateDefault } from "src/app/services/can-activate";

const routes: Route[] = [
    { path: 'create/:questionId', component: AnswerEditComponent, canActivate: [CanActivateDefault] },
    { path: 'edit/:id', component: AnswerEditComponent, canActivate: [CanActivateDefault] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnswerRoutingModule { }
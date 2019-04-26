import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { QuestionEditComponent } from "./components/question-edit/question-edit.component";
import { CanActivateDefault } from "src/app/services/can-activate";

const routes: Route[] = [
    { path: 'edit/:id', component: QuestionEditComponent, canActivate: [CanActivateDefault] },
    { path: 'create/:quizId', component: QuestionEditComponent, canActivate: [CanActivateDefault] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionRoutingModule { }
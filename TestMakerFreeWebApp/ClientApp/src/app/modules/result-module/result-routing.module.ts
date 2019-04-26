import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { ResultEditComponent } from "./components/result-edit/result-edit.component";
import { CanActivateDefault } from "src/app/services/can-activate";

const routes: Route[] = [
    { path: 'create/:quizId', component: ResultEditComponent, canActivate: [CanActivateDefault] },
    { path: 'edit/:id', component: ResultEditComponent, canActivate: [CanActivateDefault] },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ResultRoutingModule { }
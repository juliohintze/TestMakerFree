import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TesteComponent } from './components/teste/teste.component';
import { AboutComponent } from './components/about/about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'quiz' },
  { path: 'quiz', loadChildren: './modules/quiz-module/quiz.module#QuizModule' },
  { path: 'question', loadChildren: './modules/question-module/question.module#QuestionModule' },
  { path: 'answer', loadChildren: './modules/answer-module/answer.module#AnswerModule' },
  { path: 'result', loadChildren: './modules/result-module/result.module#ResultModule' },
  { path: 'user', loadChildren: './modules/user-module/user.module#UserModule' },
  { path: 'teste', component: TesteComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizEditComponent } from './components/quiz-edit/quiz-edit.component';
import { YourQuizzesComponent } from './components/your-quizzes/your-quizzes.component';
import { QuizTakeComponent } from './components/quiz-take/quiz-take.component';
import { QuizDetailComponent } from './components/quiz-detail/quiz-detail.component';
import { QuizHomeComponent } from './components/quiz-home/quiz-home.component';
import { CanActivateDefault } from 'src/app/services/can-activate';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'all' },
  { path: 'all', component: QuizHomeComponent },
  { path: 'create', component: QuizEditComponent, canActivate: [CanActivateDefault] },
  { path: 'taken', component: YourQuizzesComponent, data: { 'title': 'Taken Quizzes', 'getMethod': 'getTakenQuizzes' }, canActivate: [CanActivateDefault] },
  { path: 'liked', component: YourQuizzesComponent, data: { 'title': 'Liked Quizzes', 'getMethod': 'getLikedQuizzes' }, canActivate: [CanActivateDefault] },
  { path: 'made', component: YourQuizzesComponent, data: { 'title': 'Your Quizzes', 'getMethod': 'getYourQuizzes' }, canActivate: [CanActivateDefault] },
  { path: 'take/:id', component: QuizTakeComponent, canActivate: [CanActivateDefault] },
  { path: 'edit/:id', component: QuizEditComponent, canActivate: [CanActivateDefault] },
  { path: ':id', component: QuizDetailComponent, canActivate: [CanActivateDefault] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelperModule } from '../helper-module/helper.module';
import { QuestionModule } from '../question-module/question.module';
import { ResultModule } from '../result-module/result.module';
import { YourQuizzesComponent } from './components/your-quizzes/your-quizzes.component';
import { QuizListComponent } from './components/quiz-list/quiz-list.component';
import { QuizHomeComponent } from './components/quiz-home/quiz-home.component';
import { QuizDetailComponent } from './components/quiz-detail/quiz-detail.component';
import { QuizEditComponent } from './components/quiz-edit/quiz-edit.component';
import { QuizTakeComponent } from './components/quiz-take/quiz-take.component';

@NgModule({
  declarations: [
    YourQuizzesComponent,
    QuizListComponent,
    QuizHomeComponent,
    QuizDetailComponent,
    QuizEditComponent,
    QuizTakeComponent
  ],
  imports: [
    QuizRoutingModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HelperModule,
    QuestionModule,
    ResultModule
  ],
  exports: [
    QuizListComponent
  ]
})
export class QuizModule { }

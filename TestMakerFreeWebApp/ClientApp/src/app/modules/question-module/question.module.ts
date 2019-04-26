import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnswerModule } from '../answer-module/answer.module';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { QuestionEditComponent } from './components/question-edit/question-edit.component';
import { QuestionRoutingModule } from './question-routing.module';

@NgModule({
  declarations: [
    QuestionListComponent,
    QuestionEditComponent
  ],
  exports: [
    QuestionListComponent
  ],
  imports: [
    QuestionRoutingModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    AnswerModule
  ]
})
export class QuestionModule { }

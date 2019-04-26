import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnswerListComponent } from './components/answer-list/answer-list.component';
import { AnswerEditComponent } from './components/answer-edit/answer-edit.component';
import { AnswerRoutingModule } from './answer-routing.module';

@NgModule({
  declarations: [
    AnswerListComponent,
    AnswerEditComponent
  ],
  exports: [
    AnswerListComponent
  ],
  imports: [
    CommonModule,
    AnswerRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AnswerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResultListComponent } from './components/result-list/result-list.component';
import { ResultEditComponent } from './components/result-edit/result-edit.component';
import { ResultRoutingModule } from './result-routing.module';

@NgModule({
  declarations: [
    ResultListComponent,
    ResultEditComponent
  ],
  exports: [
    ResultListComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ResultRoutingModule
  ]
})
export class ResultModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ExpenseTrackerComponent } from './expense-tracker.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseTrackerRoutingModule } from './expense-tracker-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ExpenseTrackerComponent,
    ExpenseFormComponent,
    ExpenseListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExpenseTrackerRoutingModule,
    SharedModule
  ],
  exports: [
    ExpenseTrackerComponent
  ]
})
export class ExpenseTrackerModule { }

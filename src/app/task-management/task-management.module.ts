import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TaskManagementRoutingModule } from './task-management-routing.module';
import { TaskManagementComponent } from './task-management.component';
import { TaskCreatorComponent } from './components/task-creator/task-creator.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFilterComponent } from './components/task-filter/task-filter.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TaskManagementComponent,
    TaskCreatorComponent,
    TaskListComponent,
    TaskFilterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskManagementRoutingModule,
    SharedModule
  ]
})
export class TaskManagementModule { }


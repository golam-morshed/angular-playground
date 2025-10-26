import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EventPlannerRoutingModule } from './event-planner-routing.module';
import { EventPlannerComponent } from './event-planner.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    EventPlannerComponent,
    EventFormComponent,
    EventListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EventPlannerRoutingModule,
    SharedModule
  ],
  exports: [
    EventPlannerComponent
  ]
})
export class EventPlannerModule { }

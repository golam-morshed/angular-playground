import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventPlannerComponent } from './event-planner.component';

const routes: Routes = [
  // { path: '', component: EventPlannerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventPlannerRoutingModule { }

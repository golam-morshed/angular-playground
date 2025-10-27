import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { CustomDirectivesComponent } from './custom-directives/custom-directives.component';

const routes: Routes = [
  { path: '', redirectTo: '/expense-tracker', pathMatch: 'full' },
  { path: 'template-driven-form', component: UserRegistrationFormComponent },
  {
    path: 'reactive-form',
    loadChildren: () => import('./reactive-ems/reactive-ems.module').then(m => m.ReactiveEmsModule)
  },
  {
    path: 'course-registration',
    loadChildren: () => import('./course-registration/course-registration.module').then(m => m.CourseRegistrationModule)
  },
  {
    path: 'expense-tracker',
    loadChildren: () => import('./expense-tracker/expense-tracker.module').then(m => m.ExpenseTrackerModule)
  },
  {
    path: 'event-planner',
    loadChildren: () => import('./event-planner/event-planner.module').then(m => m.EventPlannerModule)
  },
  {
    path: 'task-management',
    loadChildren: () => import('./task-management/task-management.module').then(m => m.TaskManagementModule)
  },
  { path: 'custom-directive', component: CustomDirectivesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseRegistrationComponent } from './course-registration.component';

const routes: Routes = [
  {
    path: '',
    component: CourseRegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRegistrationRoutingModule { }


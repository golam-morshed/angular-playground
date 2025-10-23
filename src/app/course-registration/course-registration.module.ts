import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CourseRegistrationRoutingModule } from './course-registration-routing.module';
import { CourseRegistrationComponent } from './course-registration.component';
import { CourseRegistrationService } from './services/course-registration.service';

@NgModule({
  declarations: [
    CourseRegistrationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CourseRegistrationRoutingModule
  ],
  providers: [CourseRegistrationService]
})
export class CourseRegistrationModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CourseRegistrationRoutingModule } from './course-registration-routing.module';
import { CourseRegistrationComponent } from './course-registration.component';
import { CourseRegistrationService } from './services/course-registration.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CourseRegistrationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CourseRegistrationRoutingModule,
    SharedModule
  ],
  providers: [CourseRegistrationService]
})
export class CourseRegistrationModule { }


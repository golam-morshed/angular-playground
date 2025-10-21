import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ReactiveEmsRoutingModule } from './reactive-ems-routing.module';
import { ReactiveEmsComponent } from './reactive-ems.component';
import { EmployeeService } from './services/employee.service';

@NgModule({
  declarations: [
    ReactiveEmsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveEmsRoutingModule
  ],
  providers: [EmployeeService]
})
export class ReactiveEmsModule { }

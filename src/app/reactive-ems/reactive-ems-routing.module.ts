import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveEmsComponent } from './reactive-ems.component';

const routes: Routes = [
  {
    path: '',
    component: ReactiveEmsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReactiveEmsRoutingModule { }

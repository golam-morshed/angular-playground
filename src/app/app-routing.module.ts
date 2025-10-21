import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/template-driven-form', pathMatch: 'full' },
  { path: 'template-driven-form', component: UserRegistrationFormComponent },
  {
    path: 'reactive-form',
    loadChildren: () => import('./reactive-ems/reactive-ems.module').then(m => m.ReactiveEmsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

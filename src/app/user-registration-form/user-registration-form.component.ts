import { Component } from '@angular/core';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent {
  passwordDontMatch = false;
  
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  };

  onPasswordChange(password: string, confirmPassword: string) {
    if (this.user.password !== this.user.confirmPassword) {
      this.passwordDontMatch = true;
      console.log('Passwords do not match!', this.passwordDontMatch);
    } else {
      this.passwordDontMatch = false;
      console.log('Passwords match!', this.passwordDontMatch);
    }
  }
}

import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent {
  @ViewChild('registrationForm') registrationForm!: NgForm;
  passwordDontMatch = false;
  users: any[] = [];
  
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

  addUser() {
    // Create a new user object without password fields for display
    const newUser = {
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address,
    };
    
    // Add user to the array
    this.users.push(newUser);
    
    // Reset the form properly
    this.resetForm();
  }

  resetForm() {
    // Reset the user object
    this.user = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: ''
    };
    
    // Reset password validation
    this.passwordDontMatch = false;
    
    // Reset the form's touched state
    if (this.registrationForm) {
      this.registrationForm.resetForm();
    }
  }
}

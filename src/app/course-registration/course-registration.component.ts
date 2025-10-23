import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Course, CourseRegistration } from './models/course-registration.model';
import { CourseRegistrationService } from './services/course-registration.service';

@Component({
  selector: 'app-course-registration',
  templateUrl: './course-registration.component.html',
  styleUrls: ['./course-registration.component.scss']
})
export class CourseRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  availableCourses: Course[] = [];
  registrations: CourseRegistration[] = [];

  constructor(
    private fb: FormBuilder,
    private courseRegistrationService: CourseRegistrationService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAvailableCourses();
    this.loadRegistrations();
  }

  initializeForm(): void {
    this.registrationForm = this.fb.group({
      studentName: ['', [Validators.required]],
      studentEmail: ['', [Validators.required, Validators.email, this.duplicateEmailValidator.bind(this)]],
      selectedCourses: this.fb.array([], [this.minSelectedCoursesValidator(1)]),
      paymentDetails: this.fb.group({
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        cardHolderName: ['', [Validators.required]],
        expiryDate: ['', [Validators.required, this.expiryDateValidator]],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
      })
    });
  }

  // Custom validator for minimum selected courses
  minSelectedCoursesValidator(min: number) {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (formArray instanceof FormArray) {
        const selected = formArray.controls.filter(control => control.value === true);
        return selected.length >= min ? null : { minCourses: { required: min, actual: selected.length } };
      }
      return null;
    };
  }

  // Custom validator for duplicate email
  duplicateEmailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const email = control.value.trim();
    if (this.registrations.some(
      registration => registration.studentEmail === email
    )) {
      return { duplicateEmail: true };
    }
    return null;
  }

  // Custom validator for expiry date (MM/YY format)
  expiryDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!pattern.test(control.value)) {
      return { invalidFormat: true };
    }

    const [month, year] = control.value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return { expired: true };
    }

    return null;
  }

  loadAvailableCourses(): void {
    this.courseRegistrationService.getAvailableCourses().subscribe({
      next: (courses) => {
        this.availableCourses = courses;
        this.initializeCoursesFormArray();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  initializeCoursesFormArray(): void {
    const coursesFormArray = this.registrationForm.get('selectedCourses') as FormArray;
    coursesFormArray.clear();
    
    this.availableCourses.forEach(() => {
      coursesFormArray.push(this.fb.control(false));
    });
  }

  loadRegistrations(): void {
    this.courseRegistrationService.getRegistrations().subscribe({
      next: (registrations) => {
        this.registrations = registrations;
      },
      error: (error) => {
        console.error('Error loading registrations:', error);
      }
    });
  }

  get selectedCoursesArray(): FormArray {
    return this.registrationForm.get('selectedCourses') as FormArray;
  }

  get paymentDetailsGroup(): FormGroup {
    return this.registrationForm.get('paymentDetails') as FormGroup;
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.registrationForm.value;
    
    // Get selected course IDs
    const selectedCourseIds: number[] = [];
    this.availableCourses.forEach((course, index) => {
      if (formValue.selectedCourses[index]) {
        selectedCourseIds.push(course.id);
      }
    });

    const registrationData = {
      studentName: formValue.studentName,
      studentEmail: formValue.studentEmail,
      selectedCourses: selectedCourseIds,
      paymentDetails: {
        cardNumber: formValue.paymentDetails.cardNumber,
        cardHolderName: formValue.paymentDetails.cardHolderName,
        expiryDate: formValue.paymentDetails.expiryDate,
        cvv: formValue.paymentDetails.cvv
      }
    };

    this.courseRegistrationService.addRegistration(registrationData).subscribe({
      next: (newRegistration) => {
        console.log('Registration added:', newRegistration);
        this.loadRegistrations();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding registration:', error);
      }
    });
  }

  resetForm(): void {
    this.registrationForm.reset();
    this.initializeCoursesFormArray();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteRegistration(id: number): void {
    this.courseRegistrationService.deleteRegistration(id).subscribe({
    next: () => {
        console.log('Registration deleted successfully');
        this.loadRegistrations();
    },
    error: (error) => {
        console.error('Error deleting registration:', error);
    }
    });
  }


  getCourseNames(courseIds: number[]): string {
    return this.availableCourses
      .filter(course => courseIds.includes(course.id))
      .map(course => course.name)
      .join(', ');
  }

  markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
      
      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          arrayControl.markAsTouched();
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return Boolean(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minLength']) return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minLength'].requiredLength} characters`;
      if (field.errors['pattern']) return `Please enter a valid ${this.getFieldLabel(fieldName)}`;
      if (field.errors['invalidFormat']) return 'Please use MM/YY format';
      if (field.errors['expired']) return 'Card has expired';
      if (field.errors['minCourses']) return 'Please select at least one course';
      if (field.errors['duplicateEmail']) return 'Email already exists';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'studentName': 'Student Name',
      'studentEmail': 'Student Email',
      'selectedCourses': 'Courses',
      'paymentDetails.cardNumber': 'Card Number',
      'paymentDetails.cardHolderName': 'Card Holder Name',
      'paymentDetails.expiryDate': 'Expiry Date',
      'paymentDetails.cvv': 'CVV'
    };
    return labels[fieldName] || fieldName;
  }

  // Format card number for display (mask)
  maskCardNumber(cardNumber: string): string {
    if (!cardNumber) return '';
    return '**** **** ' + cardNumber.slice(-4);
  }
}


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { CustomValidators } from '../../validators/custom-validators';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode: boolean = false;
  employeeId: string | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  error: string = '';

  departments: string[] = [
    'Engineering',
    'Human Resources',
    'Sales',
    'Marketing',
    'Finance',
    'Operations'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, CustomValidators.phoneValidator()]],
      position: ['', [Validators.required]],
      department: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      hireDate: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        country: ['', [Validators.required]],
        zipCode: ['', [Validators.required]]
      }),
      skills: this.fb.array([this.fb.control('')])
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode = true;
      this.employeeId = id;
      this.loadEmployee(id);
    }
  }

  loadEmployee(id: string): void {
    this.loading = true;
    this.error = '';

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.populateForm(employee);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employee data';
        console.error(err);
        this.loading = false;
      }
    });
  }

  populateForm(employee: Employee): void {
    // Populate form fields
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      hireDate: employee.hireDate,
      address: {
        street: employee.address.street,
        city: employee.address.city,
        country: employee.address.country,
        zipCode: employee.address.zipCode
      }
    });

    // Populate skills
    this.skillsArray.clear();
    if (employee.skills && employee.skills.length > 0) {
      employee.skills.forEach(skill => {
        this.skillsArray.push(this.fb.control(skill));
      });
    } else {
      this.skillsArray.push(this.fb.control(''));
    }
  }

  get skillsArray(): FormArray {
    return this.employeeForm.get('skills') as FormArray;
  }

  addSkill(): void {
    this.skillsArray.push(this.fb.control(''));
  }

  removeSkill(index: number): void {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched(this.employeeForm);
      return;
    }

    this.submitting = true;
    this.error = '';

    const formValue = this.employeeForm.value;
    
    // Filter out empty skills
    const skills = formValue.skills.filter((skill: string) => skill && skill.trim());

    const employeeData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      position: formValue.position,
      department: formValue.department,
      salary: Number(formValue.salary),
      hireDate: formValue.hireDate,
      address: {
        street: formValue.address.street,
        city: formValue.address.city,
        country: formValue.address.country,
        zipCode: formValue.address.zipCode
      },
      skills: skills
    };

    if (this.isEditMode && this.employeeId) {
      this.updateEmployee(employeeData);
    } else {
      this.addEmployee(employeeData);
    }
  }

  addEmployee(employeeData: any): void {
    this.employeeService.addEmployee(employeeData).subscribe({
      next: () => {
        this.router.navigate(['/employee-management/employees']);
      },
      error: (err) => {
        this.error = 'Failed to add employee. Please try again.';
        console.error(err);
        this.submitting = false;
      }
    });
  }

  updateEmployee(employeeData: any): void {
    this.employeeService.updateEmployee(this.employeeId!, employeeData).subscribe({
      next: () => {
        this.router.navigate(['/employee-management/employees', this.employeeId]);
      },
      error: (err) => {
        this.error = 'Failed to update employee. Please try again.';
        console.error(err);
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    if (this.isEditMode && this.employeeId) {
      this.router.navigate(['/employee-management/employees', this.employeeId]);
    } else {
      this.router.navigate(['/employee-management/employees']);
    }
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }

      if (control instanceof FormArray) {
        control.controls.forEach(c => {
          c.markAsTouched();
        });
      }
    });
  }

  // Helper methods for template validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minLength']) return `Minimum length is ${field.errors['minLength'].requiredLength}`;
      if (field.errors['min']) return 'Value must be greater than or equal to 0';
      if (field.errors['phoneLength']) return `Phone number must be between ${field.errors['phoneLength'].min} and ${field.errors['phoneLength'].max} characters`;
    }
    
    return '';
  }
}


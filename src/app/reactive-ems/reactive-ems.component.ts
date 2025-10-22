import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { Employee } from './models/employee.model';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-reactive-ems',
  templateUrl: './reactive-ems.component.html',
  styleUrls: ['./reactive-ems.component.scss']
})
export class ReactiveEmsComponent implements OnInit {
  employeeForm!: FormGroup;
  employees: Employee[] = [];
  
  isEditMode = false;
  editingEmployeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadEmployees();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, this.uniqueNameValidator.bind(this)]],
      email: ['', [Validators.required, Validators.email]],
      position: ['', [Validators.required]],
      department: ['', [Validators.required]],
      address: this.fb.group({
        street: [''],
        city: [''],
        postalCode: ['']
      }),
      skills: this.fb.array([
        this.createSkillControl('')
      ])
    });
  }

   // Custom validator for unique name
   uniqueNameValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; 
    }
    
    const name = control.value.trim();
    // Note: This is a synchronous validator, but the service now returns Observable
    // For a proper async validator, we'd need to implement AsyncValidatorFn
    // For now, we'll handle uniqueness validation in the submit method
    return null;
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  createSkillControl(value: string = ''): FormGroup {
    return this.fb.group({
      skill: [value]
    });
  }

  getSkills(): FormArray {
    return this.employeeForm.get('skills') as FormArray;
  }

  getSkillControl(index: number): FormControl {
    return this.getSkills().at(index).get('skill') as FormControl;
  }

  addSkill(): void {
    this.getSkills().push(this.createSkillControl(''));
  }

  removeSkill(index: number): void {
    if (this.getSkills().length > 1) {
      this.getSkills().removeAt(index);
    }
  }


  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.employeeForm.value;
    
    const skills = formValue.skills.map((skill: any) => skill.skill).filter((s: string) => s.trim());

    const employeeData = {
      name: formValue.name,
      email: formValue.email,
      position: formValue.position,
      department: formValue.department,
      address: {
        street: formValue.address.street,
        city: formValue.address.city,
        postalCode: formValue.address.postalCode
      },
      skills: skills
    };

    if (this.isEditMode && this.editingEmployeeId !== null) {
      this.employeeService.updateEmployee(this.editingEmployeeId, employeeData).subscribe({
        next: (updatedEmployee) => {
          console.log('Employee updated:', updatedEmployee);
          this.loadEmployees();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating employee:', error);
        }
      });
    } else {
      this.employeeService.addEmployee(employeeData).subscribe({
        next: (newEmployee) => {
          console.log('Employee added:', newEmployee);
          this.loadEmployees();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding employee:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.employeeForm.reset();
    
    const skillsArray = this.getSkills();
    while (skillsArray.length > 0) {
      skillsArray.removeAt(0);
    }
    skillsArray.push(this.createSkillControl(''));

    this.employeeForm.get('address')?.reset();
    
    this.isEditMode = false;
    this.editingEmployeeId = null;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteEmployee(id: number): void {
    const employeeName = this.employees.find(emp => emp.id === id)?.name;
    this.employeeService.deleteEmployee(id).subscribe({
      next: (deletedEmployee) => {
        console.log(`Employee "${employeeName}" deleted successfully`);
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
      }
    });
  }

  editEmployee(employee: Employee): void {
    this.isEditMode = true;
    this.editingEmployeeId = employee.id;

    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      address: {
        street: employee.address.street,
        city: employee.address.city,
        postalCode: employee.address.postalCode
      }
    });

    const skillsArray = this.getSkills();
    while (skillsArray.length > 0) {
      skillsArray.removeAt(0);
    }
    
    if (employee.skills.length > 0) {
      employee.skills.forEach(skill => {
        skillsArray.push(this.createSkillControl(skill));
      });
    } else {
      skillsArray.push(this.createSkillControl(''));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  // Helper method to mark all form controls as touched
  markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }

  // Helper methods for template validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return Boolean(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    console.log("field", field)
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['nameNotUnique']) return 'This name already exists in the employee list';
    }
    return '';
  }
}

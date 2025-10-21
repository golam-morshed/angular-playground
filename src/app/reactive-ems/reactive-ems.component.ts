import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadEmployees();
  }

  /**
   * Initialize the form with FormBuilder
   */
  initializeForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
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

  /**
   * Create a single skill form control
   */
  createSkillControl(value: string = ''): FormGroup {
    return this.fb.group({
      skill: [value]
    });
  }

  /**
   * Get skills FormArray
   */
  getSkills(): FormArray {
    return this.employeeForm.get('skills') as FormArray;
  }

  /**
   * Get skill control by index
   */
  getSkillControl(index: number): FormControl {
    return this.getSkills().at(index).get('skill') as FormControl;
  }

  /**
   * Add a new skill field
   */
  addSkill(): void {
    this.getSkills().push(this.createSkillControl(''));
  }

  /**
   * Remove a skill field by index
   */
  removeSkill(index: number): void {
    if (this.getSkills().length > 1) {
      this.getSkills().removeAt(index);
    }
  }

  /**
   * Load employees from service
   */
  loadEmployees(): void {
    this.employees = this.employeeService.getEmployees();
  }

  /**
   * Handle form submission to add employee
   */
  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    const formValue = this.employeeForm.value;
    
    // Extract skills from FormArray
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

    // Add employee using service
    this.employeeService.addEmployee(employeeData);
    
    // Reload employees
    this.loadEmployees();

    // Reset form
    this.resetForm();

    console.log('Employee added:', employeeData);
    console.log('All employees:', this.employees);
  }

  /**
   * Reset the form to initial state
   */
  resetForm(): void {
    this.employeeForm.reset();
    
    // Reset skills array to have one empty field
    const skillsArray = this.getSkills();
    while (skillsArray.length > 0) {
      skillsArray.removeAt(0);
    }
    skillsArray.push(this.createSkillControl(''));

    // Reset address group
    this.employeeForm.get('address')?.reset();
  }

  /**
   * Delete an employee by ID
   */
  deleteEmployee(id: number): void {
    const employeeName = this.employees.find(emp => emp.id === id)?.name;
    
    // Delete using service
    const success = this.employeeService.deleteEmployee(id);
    
    if (success) {
      // Reload employees
      this.loadEmployees();
      console.log(`Employee "${employeeName}" deleted successfully`);
    }
  }
}

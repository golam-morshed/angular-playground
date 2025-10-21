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

  loadEmployees(): void {
    this.employees = this.employeeService.getEmployees();
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
      this.employeeService.updateEmployee(this.editingEmployeeId, employeeData);
      console.log('Employee updated:', employeeData);
    } else {
      this.employeeService.addEmployee(employeeData);
      console.log('Employee added:', employeeData);
    }
    
    this.loadEmployees();
    this.resetForm();
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
  }

  deleteEmployee(id: number): void {
    const employeeName = this.employees.find(emp => emp.id === id)?.name;
    const success = this.employeeService.deleteEmployee(id);
    if (success) {
      this.loadEmployees();
      console.log(`Employee "${employeeName}" deleted successfully`);
    }
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
}

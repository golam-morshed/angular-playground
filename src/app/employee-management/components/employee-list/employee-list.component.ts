import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';

    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = employees;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employees';
        console.error(err);
        this.loading = false;
      }
    });
  }

  filterEmployees(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredEmployees = this.employees;
      return;
    }

    this.filteredEmployees = this.employees.filter(emp => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const department = emp.department.toLowerCase();
      const position = emp.position.toLowerCase();
      
      return fullName.includes(term) || 
             department.includes(term) || 
             position.includes(term);
    });
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/employee-management/employees', id]);
  }

  editEmployee(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/employee-management/employees', id, 'edit']);
  }

  deleteEmployee(id: string, event: Event): void {
    event.stopPropagation();
    
    const employee = this.employees.find(emp => emp.id === id);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'this employee';
    
    if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          alert('Failed to delete employee. Please try again.');
        }
      });
    }
  }
}


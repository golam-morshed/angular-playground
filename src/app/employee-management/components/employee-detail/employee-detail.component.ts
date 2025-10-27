import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(id);
    } else {
      this.error = 'No employee ID provided';
      this.loading = false;
    }
  }

  loadEmployee(id: string): void {
    this.loading = true;
    this.error = '';

    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employee details';
        console.error(err);
        this.loading = false;
      }
    });
  }

  editEmployee(): void {
    if (this.employee) {
      this.router.navigate(['/employee-management/employees', this.employee.id, 'edit']);
    }
  }

  deleteEmployee(): void {
    if (!this.employee) return;

    const employeeName = `${this.employee.firstName} ${this.employee.lastName}`;
    
    if (confirm(`Are you sure you want to delete ${employeeName}?`)) {
      this.employeeService.deleteEmployee(this.employee.id).subscribe({
        next: () => {
          this.router.navigate(['/employee-management/employees']);
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          alert('Failed to delete employee. Please try again.');
        }
      });
    }
  }

  backToList(): void {
    this.router.navigate(['/employee-management/employees']);
  }
}


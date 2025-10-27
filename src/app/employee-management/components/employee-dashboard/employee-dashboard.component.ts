import { Component, OnInit } from '@angular/core';
import { EmployeeService, DepartmentStat } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  totalEmployees: number = 0;
  departmentStats: DepartmentStat[] = [];
  recentEmployees: Employee[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    // Load total employees count
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.totalEmployees = employees.length;
      },
      error: (err) => {
        this.error = 'Failed to load employee data';
        console.error(err);
        this.loading = false;
      }
    });

    // Load department statistics
    this.employeeService.getDepartmentStats().subscribe({
      next: (stats) => {
        this.departmentStats = stats;
      },
      error: (err) => {
        console.error('Error loading department stats:', err);
      }
    });

    // Load recent employees
    this.employeeService.getRecentEmployees(5).subscribe({
      next: (employees) => {
        this.recentEmployees = employees;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading recent employees:', err);
        this.loading = false;
      }
    });
  }
}


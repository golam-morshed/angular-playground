import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Employee } from '../models/employee.model';

export interface DepartmentStat {
  department: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiBaseUrl}/employeeManagement`;

  constructor(private http: HttpClient) { }

  /**
   * Get all employees
   */
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get employee by ID
   */
  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add new employee
   */
  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update existing employee
   */
  updateEmployee(id: string, employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, { ...employee, id }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete employee
   */
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get department statistics for dashboard
   */
  getDepartmentStats(): Observable<DepartmentStat[]> {
    return this.getEmployees().pipe(
      map(employees => {
        const departmentMap = new Map<string, number>();
        
        employees.forEach(emp => {
          const count = departmentMap.get(emp.department) || 0;
          departmentMap.set(emp.department, count + 1);
        });

        return Array.from(departmentMap.entries())
          .map(([department, count]) => ({ department, count }))
          .sort((a, b) => b.count - a.count);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get recently hired employees
   */
  getRecentEmployees(limit: number = 5): Observable<Employee[]> {
    return this.getEmployees().pipe(
      map(employees => {
        return employees
          .sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime())
          .slice(0, limit);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    console.error('EmployeeService Error:', error);
    return throwError(() => error);
  }
}


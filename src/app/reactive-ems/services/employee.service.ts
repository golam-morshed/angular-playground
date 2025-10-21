import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [];
  private idCounter = 1;

  constructor() { }

  addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const newEmployee: Employee = {
      ...employee,
      id: this.idCounter++
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  getEmployees(): Employee[] {
    return [...this.employees];
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.employees.find(emp => emp.id === id);
  }

  updateEmployee(id: number, employee: Omit<Employee, 'id'>): Employee | undefined {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      const updatedEmployee: Employee = {
        ...employee,
        id
      };
      this.employees[index] = updatedEmployee;
      return updatedEmployee;
    }
    return undefined;
  }

  deleteEmployee(id: number): boolean {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees.splice(index, 1);
      return true;
    }
    return false;
  }
}

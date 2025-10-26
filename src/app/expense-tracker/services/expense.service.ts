import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = `${environment.apiBaseUrl}/expenses`;
  private handleError(error: any): Observable<never> {
    console.error('ExpenseService Error:', error);
    return throwError(() => error);
  }

  constructor(private http: HttpClient) { }

  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense)
      .pipe(
        catchError(this.handleError)
      );
  }

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateExpense(id: number, expense: Omit<Expense, 'id'>): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, { ...expense, id })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteExpense(id: number): Observable<Expense> {
    return this.http.delete<Expense>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
}

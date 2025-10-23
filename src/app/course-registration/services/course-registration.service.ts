import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, CourseRegistration } from '../models/course-registration.model';

@Injectable({
  providedIn: 'root'
})
export class CourseRegistrationService {
  private registrationsApiUrl = `${environment.apiBaseUrl}/courseRegistrations`;
  private coursesApiUrl = `${environment.apiBaseUrl}/availableCourses`;

  constructor(private http: HttpClient) { }

  getAvailableCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesApiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  addRegistration(registration: Omit<CourseRegistration, 'id'>): Observable<CourseRegistration> {
    return this.http.post<CourseRegistration>(this.registrationsApiUrl, registration)
      .pipe(
        catchError(this.handleError)
      );
  }

  getRegistrations(): Observable<CourseRegistration[]> {
    return this.http.get<CourseRegistration[]>(this.registrationsApiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteRegistration(id: number): Observable<CourseRegistration> {
    return this.http.delete<CourseRegistration>(`${this.registrationsApiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('CourseRegistrationService Error:', error);
    return throwError(() => error);
  }
}


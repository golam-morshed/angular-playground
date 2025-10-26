import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiBaseUrl}/events`;
  
  private handleError(error: any): Observable<never> {
    console.error('EventService Error:', error);
    return throwError(() => error);
  }

  constructor(private http: HttpClient) { }

  addEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEvent(id: number, event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, { ...event, id })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteEvent(id: number): Observable<Event> {
    return this.http.delete<Event>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
}

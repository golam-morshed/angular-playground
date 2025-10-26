import { Component, OnInit, ViewChild } from '@angular/core';
import { Event, EventFormData } from './models/event.model';
import { EventService } from './services/event.service';
import { EventFormComponent } from './components/event-form/event-form.component';

@Component({
  selector: 'app-event-planner',
  templateUrl: './event-planner.component.html',
  styleUrls: ['./event-planner.component.scss']
})
export class EventPlannerComponent implements OnInit {
  @ViewChild(EventFormComponent) eventFormComponent!: EventFormComponent;
  
  events: Event[] = [];
  selectedEvent: Event | null = null;
  isEditMode: boolean = false;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      error: (error) => {
        console.error('Error loading events:', error);
      }
    });
  }

  onEventSubmit(eventData: EventFormData): void {
    if (this.isEditMode && this.selectedEvent) {
      this.eventService.updateEvent(this.selectedEvent.id, eventData).subscribe({
        next: (updatedEvent) => {
          console.log('Event updated:', updatedEvent);
          this.loadEvents();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating event:', error);
        }
      });
    } else {
      this.eventService.addEvent(eventData).subscribe({
        next: (newEvent) => {
          console.log('Event added:', newEvent);
          this.loadEvents();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding event:', error);
        }
      });
    }
  }

  onEditEvent(event: Event): void {
    this.selectedEvent = event;
    this.isEditMode = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDeleteEvent(id: number): void {
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        console.log(`Event deleted successfully`);
        this.loadEvents();
        if (this.selectedEvent?.id === id) {
          this.resetForm();
        }
      },
      error: (error) => {
        console.error('Error deleting event:', error);
      }
    });
  }

  onCancelForm(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.selectedEvent = null;
    this.isEditMode = false;
    // Also reset the child form component
    if (this.eventFormComponent) {
      this.eventFormComponent.resetFormFromParent();
    }
  }
}

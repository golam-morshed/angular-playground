import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @Input() events: Event[] = [];
  @Output() editEvent = new EventEmitter<Event>();
  @Output() deleteEvent = new EventEmitter<number>();

  ngOnInit(): void {}

  onEdit(event: Event): void {
    this.editEvent.emit(event);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.deleteEvent.emit(id);
    }
  }

}

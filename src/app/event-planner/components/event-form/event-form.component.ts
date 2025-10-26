import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Event, EventFormData, Guest, GuestFormData } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, OnChanges {
  @Input() event: Event | null = null;
  @Input() isEditMode: boolean = false;
  @Output() eventSubmit = new EventEmitter<EventFormData>();
  @Output() cancel = new EventEmitter<void>();

  eventForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] || changes['isEditMode']) {
      this.patchForm();
    }
    
    // If switching from edit mode to add mode, reset the form
    if (changes['isEditMode'] && !this.isEditMode && changes['isEditMode'].previousValue === true) {
      this.resetForm();
    }
  }

  private initializeForm(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      guests: this.fb.array([])
    });
  }

  private patchForm(): void {
    if (this.isEditMode && this.event) {
      this.eventForm.patchValue({
        title: this.event.title,
        date: this.event.date,
        location: this.event.location
      });
      
      // Clear existing guests and add new ones
      this.guests.clear();
      this.event.guests.forEach(guest => {
        this.addGuest(guest);
      });
    } else {
      // Add one empty guest by default
      if (this.guests.length === 0) {
        this.addGuest();
      }
    }
  }

  get guests(): FormArray {
    return this.eventForm.get('guests') as FormArray;
  }

  createGuestForm(guest?: Guest): FormGroup {
    return this.fb.group({
      name: [guest?.name || '', Validators.required],
      email: [guest?.email || '', [Validators.required, Validators.email]]
    });
  }

  addGuest(guest?: Guest): void {
    this.guests.push(this.createGuestForm(guest));
  }

  removeGuest(index: number): void {
    if (this.guests.length > 1) {
      this.guests.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      const eventData: EventFormData = {
        title: formValue.title,
        date: formValue.date,
        location: formValue.location,
        guests: formValue.guests.map((guest: GuestFormData, index: number) => ({
          id: this.isEditMode && this.event ? this.event.guests[index]?.id || this.generateId() : this.generateId(),
          name: guest.name,
          email: guest.email
        }))
      };
      
      this.eventSubmit.emit(eventData);
      this.resetForm();
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.eventForm.reset();
    this.guests.clear();
    this.addGuest();
  }

  // Public method to reset form from parent component
  public resetFormFromParent(): void {
    this.resetForm();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            Object.keys(arrayControl.controls).forEach(arrayKey => {
              arrayControl.get(arrayKey)?.markAsTouched();
            });
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return Boolean(field && field.invalid && field.touched);
  }

  isGuestFieldInvalid(guestIndex: number, fieldName: string): boolean {
    const guest = this.guests.at(guestIndex);
    const field = guest.get(fieldName);
    return Boolean(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
    }
    return '';
  }

  getGuestFieldError(guestIndex: number, fieldName: string): string {
    const guest = this.guests.at(guestIndex);
    const field = guest.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export interface Guest {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  guests: Guest[];
}

export interface EventFormData {
  title: string;
  date: string;
  location: string;
  guests: Guest[];
}

export interface GuestFormData {
  name: string;
  email: string;
}

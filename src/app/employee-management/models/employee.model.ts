export interface Address {
  street: string;
  city: string;
  country: string;
  zipCode: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string; // ISO date format
  address: Address;
  skills: string[];
}


export interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  address: Address;
  skills: string[];
}

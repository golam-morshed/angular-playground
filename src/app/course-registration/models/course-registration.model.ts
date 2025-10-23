export interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
}

export interface PaymentDetails {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}

export interface CourseRegistration {
  id?: number;
  studentName: string;
  studentEmail: string;
  selectedCourses: number[]; // Array of course IDs
  paymentDetails: PaymentDetails;
}


import { ReactNode } from "react";

export interface Room {
  floorName: string; 
  price: number; // Price per semester
  hostelName: string;
  id: string;
  number: string;
  floor: string;
  capacity: number;
  occupants: string[]; // Array of student registration numbers
  gender: 'Male' | 'Female' | 'Mixed';
  isReserved: boolean;
  reservedBy?: string; // Admin who reserved it
  reservedUntil?: string; // ISO date string
  isAvailable: boolean;
  features?: string[]; // e.g., ['WiFi', 'AC', 'Balcony']
  paymentDeadline?: string; // ISO date string for payment deadline
}

export interface Hostel {
  id: string;
  name: string;
  description: string;
  totalCapacity: number;
  currentOccupancy: number;
  gender: 'Male' | 'Female' | 'Mixed';
  floors: Floor[];
  isActive: boolean;
  pricePerSemester: number;
  features: string[];
  images?: string[];
}

export interface Floor {
  id: string;
  number: string;
  name: string; // e.g., "Ground Floor", "First Floor"
  rooms: Room[];
}

export interface Payment {
  id: string;
  studentRegNumber: string;
  allocationId: string;
  receiptNumber: string;
  amount: number;
  paymentMethod: 'Bank Transfer' | 'Mobile Money' | 'Cash' | 'Card' | 'Other';
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  attachments?: string[]; // URLs to uploaded receipt images
  notes?: string;
}

export interface RoomAllocation {
  id: string;
  studentRegNumber: string;
  roomId: string;
  hostelId: string;
  allocatedAt: string;
  paymentStatus: 'Pending' | 'Paid' | 'Overdue';
  paymentDeadline: string;
  semester: string;
  academicYear: string;
  paymentId?: string; // Reference to approved payment
}

export interface HostelSettings {
  paymentGracePeriod: number; // Days after allocation before payment is required
  autoRevokeUnpaidAllocations: boolean;
  maxRoomCapacity: number;
  allowMixedGender: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  profilePicture?: string;
  role: 'patient' | 'admin';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  qualifications: string;
  consultationFee: number;
  rating: number;
  image: string;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  fee: number;
  notes?: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  type: 'Lab Report' | 'Prescription' | 'Discharge Summary' | 'Radiology' | 'Other';
  date: string;
  title: string;
  description?: string;
  fileName?: string;
  fileData?: string;
  provider: string;
}

export interface Medicine {
  id: string;
  name: string;
  composition: string;
  manufacturer: string;
  price: number;
  dosage: string;
  description: string;
  prescriptionRequired: boolean;
  category: string;
  inStock: boolean;
  image: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  shippingAddress: string;
  prescriptionUploaded?: boolean;
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  preparationRequired: boolean;
  reportDeliveryTime: string;
  homeCollection: boolean;
  image: string;
}

export interface LabBooking {
  id: string;
  userId: string;
  testId: string;
  testName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'sample-collected' | 'processing' | 'completed';
  homeCollection: boolean;
  address?: string;
  reportUrl?: string;
  price: number;
}

export interface EmergencyRequest {
  id: string;
  userId: string;
  type: 'ambulance' | 'emergency-contact';
  location: string;
  destination?: string;
  emergencyType?: string;
  status: 'pending' | 'dispatched' | 'completed';
  timestamp: string;
}

export interface Hospital {
  id: string;
  name: string;
  distance: string;
  specialties: string[];
  emergencyAvailable: boolean;
  contact: string;
  address: string;
}

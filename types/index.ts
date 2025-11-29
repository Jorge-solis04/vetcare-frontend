export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Recepcionista' | 'Veterinario';
}

export interface Owner {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

export type CreateOwnerInput = Omit<Owner, 'id' | 'createdAt'>;

export interface OwnerPayload {
  name: string;
  phone?: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface PetPayload {
  name: string;
  species: string;
  breed: string;
  birthDate: string; // Formato YYYY-MM-DD
  ownerId: string;   // UUID
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  ownerId: string;
  owner: Owner; 
  createdAt: string;
  updatedAt: string;
}

export interface OwnerSummary {
  id: string;
  name: string;
}

export interface VetSummary{
  id: string;
  name: string;
}

export interface AppointmentToday {
  createdAt: string;
  date: string;
  id: string;
  pet: {
    breed: string;
    id: string;
    name: string;
    owner: {
      id: string;
      name?: string;
    };
    species: string;
  };
  petId: string;
  status: string;
  updatedAt: string;
  vet: VetSummary;
  vetId: string;
}

export interface Appointment {
  id: string
  date: string
  petId: string
  vetId: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  pet: {
    id: string
    name: string
    species: string
    breed: string
    owner: {
      id: string
      name: string
      phone: string
    }
  }
  vet: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface AppointmentPayload {
  date: string      
  petId: string
  vetId: string
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
}

export interface Vet {
  id: string;
  name: string;
  speacility: string;
  isActive: boolean;
}

export interface DashboardStats {
  appointmentsToday: AppointmentToday[];
  appointmentsTodayCount: number;
  expiringVaccines: any[]; 
}

export interface Treatment {
  id: string
  description: string
  start: string
  end: string
  petId: string
  createdAt: string
  updatedAt: string
}

export interface TreatmentPayload {
  description: string
  start: string
  end: string
  petId: string
}


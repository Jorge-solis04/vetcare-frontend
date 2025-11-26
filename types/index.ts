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

export interface DashboardStats {
  appointmentsToday: AppointmentToday[];
  appointmentsTodayCount: number;
  expiringVaccines: any[]; // Puedes tipar esto después si lo usas
}

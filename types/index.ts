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
  owner: Owner; // ✅ Objeto completo del dueño
  createdAt: string;
  updatedAt: string;
}

export interface OwnerSummary {
  id: string;
  name: string;
}
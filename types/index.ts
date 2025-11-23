export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Recepcionista' | 'Veterinario';
}

export interface Owner {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt?: string;
}

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed?: string;
  birthDate: string;
  ownerId: number;
  owner?: Owner; 
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}
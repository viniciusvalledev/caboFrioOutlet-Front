export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

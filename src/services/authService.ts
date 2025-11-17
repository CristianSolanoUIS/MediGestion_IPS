import { request } from './httpClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  estado: number;
  telefono?: string;
  direccion?: string;
  [key: string]: unknown;
}

export interface AuthRole {
  idRol: number;
  nombre: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
  roles: AuthRole[];
}

export interface ProfileResponse {
  user: AuthUser;
  roles: AuthRole[];
}

export async function login(credentials: LoginCredentials, signal?: AbortSignal): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
    signal
  });
}

export async function fetchProfile(signal?: AbortSignal): Promise<ProfileResponse> {
  return request<ProfileResponse>('/auth/profile', {
    method: 'GET',
    signal
  });
}

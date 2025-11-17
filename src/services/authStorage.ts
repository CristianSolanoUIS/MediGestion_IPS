const ACCESS_TOKEN_KEY = 'mg:accessToken';
const USER_KEY = 'mg:user';
const ROLES_KEY = 'mg:roles';
const SELECTED_ROLE_KEY = 'mg:selectedRole';

export type AvailableRole = 'paciente' | 'profesional' | 'administrador' | 'director';

interface StoredUser {
  id: number;
  nombre: string;
  email: string;
  estado: number;
  [key: string]: unknown;
}

interface StoredRole {
  idRol: number;
  nombre: string;
  [key: string]: unknown;
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function setUser(user: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredUser;
  } catch (error) {
    console.warn('No se pudo parsear el usuario almacenado', error);
    return null;
  }
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function setRoles(roles: StoredRole[]): void {
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
}

export function getRoles(): StoredRole[] {
  const raw = localStorage.getItem(ROLES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as StoredRole[];
  } catch (error) {
    console.warn('No se pudo parsear los roles almacenados', error);
    return [];
  }
}

export function clearRoles(): void {
  localStorage.removeItem(ROLES_KEY);
}

export function clearAuthStorage(): void {
  clearAccessToken();
  clearUser();
  clearRoles();
}

export function setSelectedRole(role: AvailableRole): void {
  localStorage.setItem(SELECTED_ROLE_KEY, role);
}

export function getSelectedRole(): AvailableRole | null {
  const value = localStorage.getItem(SELECTED_ROLE_KEY);
  if (!value) {
    return null;
  }
  if (value === 'paciente' || value === 'profesional' || value === 'administrador' || value === 'director') {
    return value;
  }
  return null;
}

export function clearSelectedRole(): void {
  localStorage.removeItem(SELECTED_ROLE_KEY);
}

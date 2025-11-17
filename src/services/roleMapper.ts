import { AvailableRole } from './authStorage';
import { AuthRole } from './authService';

const ROLE_HOME_PATH: Record<AvailableRole, string> = {
  paciente: '/dashboard',
  profesional: '/pro/dashboard',
  administrador: '/admin/dashboard',
  director: '/director/dashboard'
};

const ROLE_KEYWORDS: Record<AvailableRole, string[]> = {
  paciente: ['paciente', 'rol paciente', 'usuario paciente'],
  profesional: ['profesional', 'profesional de salud', 'personal salud', 'personal de salud', 'medico', 'doctor'],
  administrador: ['administrador', 'admin', 'administrativo'],
  director: ['director', 'directivo', 'gerente']
};

export const normalizeRoleName = (value?: string | null): string => {
  if (!value) {
    return '';
  }
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const mapRoleNameToAvailableRole = (value?: string | null): AvailableRole | null => {
  const normalized = normalizeRoleName(value);
  if (!normalized) {
    return null;
  }

  for (const [roleId, keywords] of Object.entries(ROLE_KEYWORDS) as [AvailableRole, string[]][]) {
    if (keywords.some((keyword) => normalized === keyword || normalized.includes(keyword))) {
      return roleId;
    }
  }

  return null;
};

export const mapAuthRolesToAvailableRoles = (roles: AuthRole[] = []): AvailableRole[] => {
  const resolved = roles
    .map((role) => mapRoleNameToAvailableRole(role?.nombre))
    .filter((role): role is AvailableRole => Boolean(role));

  return Array.from(new Set(resolved));
};

export const getRoleHomePath = (role: AvailableRole): string => ROLE_HOME_PATH[role];

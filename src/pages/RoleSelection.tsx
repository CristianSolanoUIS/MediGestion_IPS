import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';
import { AvailableRole, setSelectedRole, getAccessToken, getRoles, getUser } from '../services/authStorage';
import { mapRoleNameToAvailableRole, getRoleHomePath } from '../services/roleMapper';

const resolveRoleName = (role: unknown, visited = new WeakSet<object>()): string => {
  if (typeof role === 'string') {
    return role;
  }

  if (Array.isArray(role)) {
    for (const item of role) {
      const resolved = resolveRoleName(item, visited);
      if (resolved) {
        return resolved;
      }
    }
    return '';
  }

  if (role && typeof role === 'object') {
    if (visited.has(role as object)) {
      return '';
    }
    visited.add(role as object);

    const possibleKeys = ['nombre', 'name', 'descripcion', 'description', 'nombreRol', 'rol', 'role', 'value'];
    for (const key of possibleKeys) {
      const value = (role as Record<string, unknown>)[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value;
      }
      if (value) {
        const nested = resolveRoleName(value, visited);
        if (nested) {
          return nested;
        }
      }
    }

    for (const value of Object.values(role as Record<string, unknown>)) {
      const nested = resolveRoleName(value, visited);
      if (nested) {
        return nested;
      }
    }
  }

  return '';
};

const collectRoleCandidates = (source: unknown, visited = new WeakSet<object>()): string[] => {
  if (!source) {
    return [];
  }

  if (typeof source === 'string') {
    return [source];
  }

  if (typeof source === 'number' || typeof source === 'boolean') {
    return [String(source)];
  }

  if (Array.isArray(source)) {
    return source.flatMap((item) => collectRoleCandidates(item, visited));
  }

  if (typeof source === 'object') {
    if (visited.has(source as object)) {
      return [];
    }
    visited.add(source as object);

    const candidates: string[] = [];

    Object.values(source as Record<string, unknown>).forEach((value) => {
      candidates.push(...collectRoleCandidates(value, visited));
    });

    return candidates;
  }

  return [];
};

interface RoleOption {
  id: AvailableRole;
  title: string;
  description: string;
  accent: string;
  icon: React.ReactNode;
}

const ROLE_OPTIONS: Record<AvailableRole, RoleOption> = {
  paciente: {
    id: 'paciente',
    title: 'Paciente',
    description: 'Agenda y gestiona tus citas, notificaciones y PQRS.',
    accent: 'role-accent-blue',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 17C21.3137 17 24 14.3137 24 11C24 7.68629 21.3137 5 18 5C14.6863 5 12 7.68629 12 11C12 14.3137 14.6863 17 18 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M29 31.0002C29 25.4772 24.5228 21.0002 19 21.0002H17C11.4772 21.0002 7 25.4772 7 31.0002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  profesional: {
    id: 'profesional',
    title: 'Profesional de Salud',
    description: 'Consulta tu agenda, historias clínicas y tareas asignadas.',
    accent: 'role-accent-green',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 7H29V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 29H7V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M29 22V29H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 14V7H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 13L13 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  administrador: {
    id: 'administrador',
    title: 'Administrador',
    description: 'Gestiona usuarios, citas y operaciones del centro médico.',
    accent: 'role-accent-purple',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 27C11 26.4696 11.2107 25.9609 11.5858 25.5858C11.9609 25.2107 12.4696 25 13 25H23C23.5304 25 24.0391 25.2107 24.4142 25.5858C24.7893 25.9609 25 26.4696 25 27V31H11V27Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 31H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 21C20.7614 21 23 18.7614 23 16C23 13.2386 20.7614 11 18 11C15.2386 11 13 13.2386 13 16C13 18.7614 15.2386 21 18 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 5H29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  director: {
    id: 'director',
    title: 'Director',
    description: 'Supervisa reportes, indicadores y gestión estratégica.',
    accent: 'role-accent-orange',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 11H29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 27H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 27H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 27H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 19H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 19H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7L15 3H21L24 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
};

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const [availableRoles, setAvailableRoles] = useState<AvailableRole[]>([]);
  const [unknownRoles, setUnknownRoles] = useState<string[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    let rawRoles: unknown[] = getRoles();
    if (!Array.isArray(rawRoles)) {
      rawRoles = [];
    }
    if (rawRoles.length === 0) {
      const storedUser = getUser();
      const derived = collectRoleCandidates(storedUser ?? null);
      rawRoles = derived;
    }

    if (rawRoles.length === 0) {
      setAvailableRoles([]);
      setUnknownRoles([]);
      setIsReady(true);
      return;
    }

    const recognized: AvailableRole[] = [];
    const unknown: string[] = [];

    rawRoles.forEach((role) => {
      const roleName = resolveRoleName(role);
      const resolved = mapRoleNameToAvailableRole(roleName);
      if (resolved) {
        if (!recognized.includes(resolved)) {
          recognized.push(resolved);
        }
      } else {
        const fallbackLabel = roleName || `Rol sin nombre (ID ${(role as { idRol?: unknown })?.idRol ?? 'desconocido'})`;
        unknown.push(fallbackLabel);
      }
    });

    setAvailableRoles(recognized);
    setUnknownRoles(unknown);
    setIsReady(true);
  }, [navigate]);

  const handleSelect = (role: AvailableRole) => {
    setSelectedRole(role);
    navigate(getRoleHomePath(role));
  };

  const roleCards = useMemo(() => availableRoles.map((roleId) => ROLE_OPTIONS[roleId]), [availableRoles]);

  if (!isReady) {
    return null;
  }

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <div className="role-selection-icon">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="72" height="72" rx="20" fill="#1A67FD" opacity="0.08" />
            <path d="M36 24C32.134 24 29 27.134 29 31C29 34.866 32.134 38 36 38C39.866 38 43 34.866 43 31C43 27.134 39.866 24 36 24ZM36 41C31.0294 41 24 43.6863 24 48.5V51H48V48.5C48 43.6863 40.9706 41 36 41Z" fill="#1A67FD" />
          </svg>
        </div>
        <div className="role-selection-header">
          <h1 className="role-selection-title">Selecciona tu Rol</h1>
          <p className="role-selection-subtitle">Elige la vista con la que deseas ingresar a MediGestión IPS</p>
        </div>

        {roleCards.length > 0 && (
          <div className="role-grid">
            {roleCards.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`role-card ${role.accent}`}
                onClick={() => handleSelect(role.id)}
              >
                <div className="role-card-icon">{role.icon}</div>
                <div className="role-card-text">
                  <h2>{role.title}</h2>
                  <p>{role.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {roleCards.length === 0 && (
          <div className="role-empty-state">
            <h2>No encontramos roles disponibles</h2>
            <p>
              Tu usuario no tiene roles asignados o no pudimos reconocerlos. Comunícate con el administrador
              para que valide tu acceso.
            </p>
            <button type="button" onClick={() => navigate('/login', { replace: true })}>
              Volver al inicio de sesión
            </button>
          </div>
        )}

        {unknownRoles.length > 0 && (
          <p className="role-warning">
            Nota: no pudimos mostrar algunos roles ({unknownRoles.join(', ')}). Si necesitas acceso adicional,
            consulta con el administrador.
          </p>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;

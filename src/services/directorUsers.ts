import { request } from './httpClient';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface RoleRecord {
  idRol: number;
  nombreRol: string;
  descripcion?: string | null;
  estado?: number | string | null;
}

export interface UserRecord {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null | undefined;
  direccion: string | null | undefined;
  estado: 0 | 1;
}

export interface SafeUsuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  direccion?: string | null;
  estado: 'ACTIVO' | 'INACTIVO' | 0 | 1;
}

export interface DirectorProfile {
  idUsuario: number;
  cargo?: string | null;
  usuario: SafeUsuario;
}

export interface AdministrativoProfile {
  idUsuario: number;
  area?: string | null;
  usuario: SafeUsuario;
}

export interface PersonalSaludProfile {
  idUsuario: number;
  especialidad?: string | null;
  numeroLicencia?: string | null;
  sede?: string | null;
  usuario: SafeUsuario;
}

export interface PacienteProfile {
  idUsuario: number;
  idHistoriaClinica: string;
  usuario: SafeUsuario;
}

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  inactivos?: boolean;
}

const toPaginationPayload = <T>(payload: unknown): PaginatedResult<T> => {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidates = [record.items, record.data, record.results];
    const items = candidates.find((candidate): candidate is T[] => Array.isArray(candidate)) ?? [];
    const totalRaw = record.total ?? record.count ?? items.length;
    const pageRaw = record.page ?? record.currentPage ?? 1;
    const limitRaw = record.limit ?? record.pageSize ?? items.length;

    const total = typeof totalRaw === 'number' ? totalRaw : items.length;
    const page = typeof pageRaw === 'number' ? pageRaw : parseInt(String(pageRaw), 10) || 1;
    const limit = typeof limitRaw === 'number' ? limitRaw : parseInt(String(limitRaw), 10) || items.length;

    return { items, total, page, limit };
  }

  return { items: [], total: 0, page: 1, limit: 0 };
};

const buildQuery = (params: FetchUsersParams = {}): string => {
  const searchParams = new URLSearchParams();

  if (typeof params.page === 'number' && Number.isFinite(params.page)) {
    searchParams.append('page', String(params.page));
  }

  if (typeof params.limit === 'number' && Number.isFinite(params.limit)) {
    searchParams.append('limit', String(params.limit));
  }

  if (params.search) {
    searchParams.append('search', params.search);
    searchParams.append('q', params.search);
  }

  if (typeof params.inactivos === 'boolean') {
    searchParams.append('inactivos', params.inactivos ? 'true' : 'false');
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const fetchUsers = async (params: FetchUsersParams = {}): Promise<PaginatedResult<UserRecord>> => {
  const payload = await request<unknown>(`/usuarios${buildQuery(params)}`);
  return toPaginationPayload<UserRecord>(payload);
};

export const fetchUser = (id: number | string): Promise<UserRecord> => request(`/usuarios/${id}`);

export interface CreateUserPayload {
  nombre: string;
  email: string;
  password: string;
  roleId: number;
  telefono?: string | null;
  direccion?: string | null;
  estado?: 0 | 1;
}

export interface UpdateUserPayload {
  nombre?: string;
  email?: string;
  password?: string;
  roleId?: number;
  telefono?: string | null;
  direccion?: string | null;
  estado?: 0 | 1;
}

export const createUser = (data: CreateUserPayload): Promise<UserRecord> =>
  request('/usuarios', {
    method: 'POST',
    body: data
  });

export const updateUser = (id: number | string, data: UpdateUserPayload): Promise<UserRecord> =>
  request(`/usuarios/${id}`, {
    method: 'PUT',
    body: data
  });

export const activateUser = (id: number | string): Promise<UserRecord> =>
  request(`/usuarios/${id}/activar`, {
    method: 'PATCH'
  });

export const deactivateUser = (id: number | string): Promise<UserRecord> =>
  request(`/usuarios/${id}/inactivar`, {
    method: 'PATCH'
  });

export const toggleUserState = (id: number | string, enable: boolean): Promise<UserRecord> =>
  enable ? activateUser(id) : deactivateUser(id);

export const deleteUser = (id: number | string, force = false): Promise<void> =>
  request(`/usuarios/${id}?force=${force ? 'true' : 'false'}`, {
    method: 'DELETE'
  });

export const fetchRoles = async (): Promise<RoleRecord[]> => {
  const payload = await request<unknown>('/roles');

  if (Array.isArray(payload)) {
    return payload as RoleRecord[];
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidates = [record.items, record.data, record.results];
    const items = candidates.find((candidate): candidate is RoleRecord[] => Array.isArray(candidate));
    if (items) {
      return items;
    }
  }

  return [];
};

export const fetchUserRoles = async (id: number | string): Promise<RoleRecord[]> => {
  const payload = await request<unknown>(`/usuarios/${id}/roles`);

  if (Array.isArray(payload)) {
    return payload as RoleRecord[];
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidates = [record.items, record.data, record.results];
    const items = candidates.find((candidate): candidate is RoleRecord[] => Array.isArray(candidate));
    if (items) {
      return items;
    }
  }

  return [];
};

export const assignUserRole = (userId: number | string, roleId: number | string): Promise<void> =>
  request(`/usuarios/${userId}/roles`, {
    method: 'POST',
    body: { roleId }
  });

export const removeUserRole = (userId: number | string, roleId: number | string): Promise<void> =>
  request(`/usuarios/${userId}/roles/${roleId}`, {
    method: 'DELETE'
  });

const getProfile = <T>(endpoint: string, idUsuario?: number | string): Promise<T> => {
  const suffix = typeof idUsuario === 'undefined' ? '' : `/${idUsuario}`;
  return request<T>(`${endpoint}${suffix}`);
};

const createProfile = <TRequest extends object, TResponse>(endpoint: string, body: TRequest): Promise<TResponse> =>
  request(endpoint, {
    method: 'POST',
    body
  });

const updateProfile = <TRequest extends object, TResponse>(endpoint: string, idUsuario: number | string, body: TRequest): Promise<TResponse> =>
  request(`${endpoint}/${idUsuario}`, {
    method: 'PATCH',
    body
  });

const deleteProfile = (endpoint: string, idUsuario: number | string): Promise<void> =>
  request(`${endpoint}/${idUsuario}`, {
    method: 'DELETE'
  });

export const fetchDirectors = (): Promise<DirectorProfile[]> => getProfile<DirectorProfile[]>('/director');
export const fetchDirectorProfile = (idUsuario: number | string): Promise<DirectorProfile> => getProfile<DirectorProfile>('/director', idUsuario);
export const createDirectorProfile = (payload: { idUsuario: number; cargo?: string | null }): Promise<DirectorProfile> => createProfile('/director', payload);
export const updateDirectorProfile = (idUsuario: number | string, payload: { cargo?: string | null }): Promise<DirectorProfile> =>
  updateProfile('/director', idUsuario, payload);
export const deleteDirectorProfile = (idUsuario: number | string): Promise<void> => deleteProfile('/director', idUsuario);

export const fetchAdministrativos = (): Promise<AdministrativoProfile[]> => getProfile<AdministrativoProfile[]>('/administrativos');
export const fetchAdministrativoProfile = (idUsuario: number | string): Promise<AdministrativoProfile> =>
  getProfile<AdministrativoProfile>('/administrativos', idUsuario);
export const createAdministrativoProfile = (payload: { idUsuario: number; area?: string | null }): Promise<AdministrativoProfile> =>
  createProfile('/administrativos', payload);
export const updateAdministrativoProfile = (idUsuario: number | string, payload: { area?: string | null }): Promise<AdministrativoProfile> =>
  updateProfile('/administrativos', idUsuario, payload);
export const deleteAdministrativoProfile = (idUsuario: number | string): Promise<void> => deleteProfile('/administrativos', idUsuario);

export const fetchPersonalSalud = (): Promise<PersonalSaludProfile[]> => getProfile<PersonalSaludProfile[]>('/personal-salud');
export const fetchPersonalSaludProfile = (idUsuario: number | string): Promise<PersonalSaludProfile> =>
  getProfile<PersonalSaludProfile>('/personal-salud', idUsuario);
export const createPersonalSaludProfile = (payload: {
  idUsuario: number;
  especialidad?: string | null;
  numeroLicencia?: string | null;
  sede?: string | null;
}): Promise<PersonalSaludProfile> => createProfile('/personal-salud', payload);
export const updatePersonalSaludProfile = (
  idUsuario: number | string,
  payload: { especialidad?: string | null; numeroLicencia?: string | null; sede?: string | null }
): Promise<PersonalSaludProfile> => updateProfile('/personal-salud', idUsuario, payload);
export const deletePersonalSaludProfile = (idUsuario: number | string): Promise<void> => deleteProfile('/personal-salud', idUsuario);

export const fetchPacientes = (): Promise<PacienteProfile[]> => getProfile<PacienteProfile[]>('/pacientes');
export const fetchPacienteProfile = (idUsuario: number | string): Promise<PacienteProfile> => getProfile<PacienteProfile>('/pacientes', idUsuario);
export const createPacienteProfile = (payload: { idUsuario: number; idHistoriaClinica: string }): Promise<PacienteProfile> =>
  createProfile('/pacientes', payload);
export const updatePacienteProfile = (idUsuario: number | string, payload: { idHistoriaClinica?: string }): Promise<PacienteProfile> =>
  updateProfile('/pacientes', idUsuario, payload);
export const deletePacienteProfile = (idUsuario: number | string): Promise<void> => deleteProfile('/pacientes', idUsuario);

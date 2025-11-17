import React, { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDirector from '../../components/NavbarDirector';
import '../../styles/DirectorPortal.css';
import './GestionUsuarios.css';
import {
  assignUserRole,
  createAdministrativoProfile,
  createDirectorProfile,
  createPacienteProfile,
  createPersonalSaludProfile,
  createUser,
  deleteAdministrativoProfile,
  deleteDirectorProfile,
  deletePacienteProfile,
  deletePersonalSaludProfile,
  type FetchUsersParams,
  fetchAdministrativoProfile,
  fetchDirectorProfile,
  fetchPacienteProfile,
  fetchPersonalSaludProfile,
  fetchRoles,
  fetchUserRoles,
  fetchUsers,
  removeUserRole,
  toggleUserState,
  updateAdministrativoProfile,
  updateDirectorProfile,
  updatePacienteProfile,
  updatePersonalSaludProfile,
  type AdministrativoProfile,
  type DirectorProfile,
  type PacienteProfile,
  type PersonalSaludProfile,
  type RoleRecord,
  type UserRecord
} from '../../services/directorUsers';
import { isHttpError } from '../../services/httpClient';

const PAGE_SIZE = 10;

type StatusFilter = 'all' | 'active' | 'inactive';

type SafeRoleRecord = RoleRecord & {
  id?: number;
  idRol?: number;
  nombre?: string;
  nombreRol?: string;
};

type SafeUserRecord = UserRecord & {
  nombre?: string;
  apellido?: string;
  correo?: string;
  email?: string;
  identificacion?: string;
  telefono?: string | null;
  estado?: UserRecord['estado'] | 0 | 1 | 'ACTIVO' | 'INACTIVO';
};

const getRoleId = (role: SafeRoleRecord): number | undefined => {
  if (typeof role.id === 'number') {
    return role.id;
  }
  if (typeof role.idRol === 'number') {
    return role.idRol;
  }
  return undefined;
};

const getRoleName = (role: SafeRoleRecord): string => {
  if (typeof role.nombre === 'string') {
    return role.nombre;
  }
  if (typeof role.nombreRol === 'string') {
    return role.nombreRol;
  }
  return 'Rol';
};

const isEstadoActivo = (estado: unknown): boolean => {
  if (typeof estado === 'string') {
    return estado.toUpperCase() === 'ACTIVO';
  }
  if (typeof estado === 'number') {
    return estado === 1;
  }
  return Boolean(estado);
};

type ProfileType = 'director' | 'administrativo' | 'personalSalud' | 'paciente';

type ProfileFormValues = Record<string, string>;

interface ProfileFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

interface ProfileConfig {
  label: string;
  description: string;
  roleKeywords: string[];
  fields: ProfileFieldConfig[];
  buildEmptyForm: () => ProfileFormValues;
  toForm: (profile: unknown) => ProfileFormValues;
  fetch: (idUsuario: number) => Promise<unknown>;
  create: (idUsuario: number, form: ProfileFormValues) => Promise<unknown>;
  update: (idUsuario: number, form: ProfileFormValues) => Promise<unknown>;
  remove?: (idUsuario: number) => Promise<void>;
}

const PROFILE_TYPES: ProfileType[] = ['director', 'administrativo', 'personalSalud', 'paciente'];

const normalizeText = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const nullableField = (value: string | undefined): string | null => {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
};

const PROFILE_CONFIGS: Record<ProfileType, ProfileConfig> = {
  director: {
    label: 'Dirección',
    description: 'Define el cargo directivo asignado a este usuario.',
    roleKeywords: ['director'],
    fields: [{ name: 'cargo', label: 'Cargo', placeholder: 'Director médico regional', required: true }],
    buildEmptyForm: () => ({ cargo: '' }),
    toForm: (profile) => ({ cargo: ((profile as DirectorProfile)?.cargo ?? '') as string }),
    fetch: (idUsuario: number) => fetchDirectorProfile(idUsuario),
    create: (idUsuario: number, form) => createDirectorProfile({ idUsuario, cargo: nullableField(form.cargo) }),
    update: (idUsuario: number, form) => updateDirectorProfile(idUsuario, { cargo: nullableField(form.cargo) }),
    remove: (idUsuario: number) => deleteDirectorProfile(idUsuario)
  },
  administrativo: {
    label: 'Administrativo',
    description: 'Configura el área administrativa responsable.',
    roleKeywords: ['administrativo', 'gestion', 'gestión', 'asistente'],
    fields: [{ name: 'area', label: 'Área', placeholder: 'Gestión documental', required: true }],
    buildEmptyForm: () => ({ area: '' }),
    toForm: (profile) => ({ area: ((profile as AdministrativoProfile)?.area ?? '') as string }),
    fetch: (idUsuario: number) => fetchAdministrativoProfile(idUsuario),
    create: (idUsuario: number, form) => createAdministrativoProfile({ idUsuario, area: nullableField(form.area) }),
    update: (idUsuario: number, form) => updateAdministrativoProfile(idUsuario, { area: nullableField(form.area) }),
    remove: (idUsuario: number) => deleteAdministrativoProfile(idUsuario)
  },
  personalSalud: {
    label: 'Personal de salud',
    description: 'Registra la especialidad y habilitaciones clínicas.',
    roleKeywords: ['salud', 'medico', 'médico', 'doctor', 'profesional', 'enfermera', 'enfermero'],
    fields: [
      { name: 'especialidad', label: 'Especialidad', placeholder: 'Medicina general', required: true },
      { name: 'numeroLicencia', label: 'Número de licencia', placeholder: 'RM-123456', required: true },
      { name: 'sede', label: 'Sede', placeholder: 'Sede central', required: true }
    ],
    buildEmptyForm: () => ({ especialidad: '', numeroLicencia: '', sede: '' }),
    toForm: (profile) => ({
      especialidad: ((profile as PersonalSaludProfile)?.especialidad ?? '') as string,
      numeroLicencia: ((profile as PersonalSaludProfile)?.numeroLicencia ?? '') as string,
      sede: ((profile as PersonalSaludProfile)?.sede ?? '') as string
    }),
    fetch: (idUsuario: number) => fetchPersonalSaludProfile(idUsuario),
    create: (idUsuario: number, form) =>
      createPersonalSaludProfile({
        idUsuario,
        especialidad: nullableField(form.especialidad),
        numeroLicencia: nullableField(form.numeroLicencia),
        sede: nullableField(form.sede)
      }),
    update: (idUsuario: number, form) =>
      updatePersonalSaludProfile(idUsuario, {
        especialidad: nullableField(form.especialidad),
        numeroLicencia: nullableField(form.numeroLicencia),
        sede: nullableField(form.sede)
      }),
    remove: (idUsuario: number) => deletePersonalSaludProfile(idUsuario)
  },
  paciente: {
    label: 'Paciente',
    description: 'Vincula la historia clínica del usuario en el sistema.',
    roleKeywords: ['paciente'],
    fields: [{ name: 'idHistoriaClinica', label: 'Historia clínica', placeholder: 'HC-00001', required: true }],
    buildEmptyForm: () => ({ idHistoriaClinica: '' }),
    toForm: (profile) => ({ idHistoriaClinica: ((profile as PacienteProfile)?.idHistoriaClinica ?? '') as string }),
    fetch: (idUsuario: number) => fetchPacienteProfile(idUsuario),
    create: (idUsuario: number, form) =>
      createPacienteProfile({ idUsuario, idHistoriaClinica: form.idHistoriaClinica?.trim() ?? '' }),
    update: (idUsuario: number, form) => updatePacienteProfile(idUsuario, { idHistoriaClinica: form.idHistoriaClinica?.trim() ?? '' }),
    remove: (idUsuario: number) => deletePacienteProfile(idUsuario)
  }
};

const resolveProfileTypes = (roles: SafeRoleRecord[]): ProfileType[] => {
  if (!roles || roles.length === 0) {
    return [];
  }

  const normalizedRoleNames = roles.map((role) => normalizeText(getRoleName(role)));

  return PROFILE_TYPES.filter((type) => {
    const keywords = PROFILE_CONFIGS[type].roleKeywords.map(normalizeText);
    return normalizedRoleNames.some((roleName) => keywords.some((keyword) => roleName.includes(keyword)));
  });
};

interface ProfileState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  form: ProfileFormValues;
  hasProfile: boolean;
  error: string | null;
  success: string | null;
  isSaving: boolean;
}

const createEmptyProfileState = (type: ProfileType): ProfileState => ({
  status: 'idle',
  form: PROFILE_CONFIGS[type].buildEmptyForm(),
  hasProfile: false,
  error: null,
  success: null,
  isSaving: false
});

const buildProfileStateMap = (): Record<ProfileType, ProfileState> => {
  return PROFILE_TYPES.reduce((acc, type) => {
    acc[type] = createEmptyProfileState(type);
    return acc;
  }, {} as Record<ProfileType, ProfileState>);
};

interface CreateUserFormValues {
  nombre: string;
  email: string;
  password: string;
  roleId: string;
  telefono: string;
  direccion: string;
  estado: '1' | '0';
}

const EMPTY_CREATE_FORM: CreateUserFormValues = {
  nombre: '',
  email: '',
  password: '',
  roleId: '',
  telefono: '',
  direccion: '',
  estado: '1'
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GestionUsuarios: React.FC = () => {
  const navigate = useNavigate();
  const [rawUsers, setRawUsers] = useState<SafeUserRecord[]>([]);
  const [users, setUsers] = useState<SafeUserRecord[]>([]);
  const [userRolesMap, setUserRolesMap] = useState<Map<number, SafeRoleRecord[]>>(new Map());
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalFromServer, setTotalFromServer] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roles, setRoles] = useState<SafeRoleRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [stateToggleId, setStateToggleId] = useState<number | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createValues, setCreateValues] = useState<CreateUserFormValues>(EMPTY_CREATE_FORM);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [roleModalUser, setRoleModalUser] = useState<SafeUserRecord | null>(null);
  const [roleModalLoading, setRoleModalLoading] = useState<boolean>(false);
  const [roleModalError, setRoleModalError] = useState<string | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(new Set());
  const [initialRoleIds, setInitialRoleIds] = useState<Set<number>>(new Set());
  const [isSavingRoles, setIsSavingRoles] = useState<boolean>(false);

  const [profilePanelOpen, setProfilePanelOpen] = useState<boolean>(false);
  const [profilePanelUser, setProfilePanelUser] = useState<SafeUserRecord | null>(null);
  const [profileTabs, setProfileTabs] = useState<ProfileType[]>([]);
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileType | null>(null);
  const [profileStates, setProfileStates] = useState<Record<ProfileType, ProfileState>>(() => buildProfileStateMap());

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchTerm]);

  const loadUsers = useCallback(
    async (options?: { signal?: AbortSignal }): Promise<boolean> => {
      const { signal } = options ?? {};
      setIsLoading(true);
      setLoadError(null);

      let succeeded = false;

      try {
        const payload = await fetchUsers({
          page,
          pageSize: PAGE_SIZE
        } as FetchUsersParams);

        if (signal?.aborted) {
          return false;
        }

        const items = payload.items ?? [];
        setRawUsers(items);
        const totalValue = typeof payload.total === 'number' ? payload.total : items.length;
        setTotalFromServer(Number.isFinite(totalValue) ? totalValue : items.length);
        succeeded = true;
      } catch (error) {
        if (signal?.aborted) {
          return false;
        }

        if (isHttpError(error)) {
          setLoadError(error.message);
        } else if (error instanceof Error) {
          setLoadError(error.message);
        } else {
          setLoadError('No se pudieron cargar los usuarios.');
        }
        setRawUsers([]);
        setTotalFromServer(0);
      } finally {
        if (!signal || !signal.aborted) {
          setIsLoading(false);
        }
      }

      return succeeded;
    },
    [page]
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadUsers({ signal: controller.signal });
    return () => {
      controller.abort();
    };
  }, [loadUsers]);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const fetchedRoles = (await fetchRoles()) as SafeRoleRecord[];
        if (!active) {
          return;
        }
        const sorted = [...fetchedRoles].sort((a, b) => getRoleName(a).localeCompare(getRoleName(b)));
        setRoles(sorted);
      } catch (error) {
        console.warn('No se pudieron cargar los roles', error);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (rawUsers.length === 0) {
      setUsers([]);
      setTotalUsers(0);
      return;
    }

    const normalizedSearch = debouncedSearch.trim().toLowerCase();
    const roleIdFilterRaw = selectedRole !== 'all' ? Number(selectedRole) : undefined;
    const hasRoleFilter = typeof roleIdFilterRaw === 'number' && !Number.isNaN(roleIdFilterRaw);
    const roleIdFilter = hasRoleFilter ? roleIdFilterRaw : undefined;
    const hasSearch = normalizedSearch.length > 0;
    const hasStatusFilter = statusFilter !== 'all';

    const matchesSearchTerm = (user: SafeUserRecord): boolean => {
      if (!hasSearch) {
        return true;
      }
      const candidates = [user.nombre, user.apellido, user.correo ?? user.email, user.identificacion];
      return candidates.some((value) => typeof value === 'string' && value.toLowerCase().includes(normalizedSearch));
    };

    const matchesStatus = (user: SafeUserRecord): boolean => {
      if (!hasStatusFilter) {
        return true;
      }
      const active = isEstadoActivo(user.estado);
      return statusFilter === 'active' ? active : !active;
    };

    const matchesRole = (user: SafeUserRecord): boolean => {
      if (!hasRoleFilter) {
        return true;
      }
      const assignedRoles = userRolesMap.get(user.id);
      if (!assignedRoles) {
        return true;
      }
      return assignedRoles.some((role) => getRoleId(role) === roleIdFilter);
    };

    const filteredUsers = rawUsers.filter((user) => matchesSearchTerm(user) && matchesStatus(user) && matchesRole(user));
    const hasAnyFilter = hasRoleFilter || hasSearch || hasStatusFilter;

    if (hasAnyFilter) {
      setUsers(filteredUsers);
      setTotalUsers(filteredUsers.length);
    } else {
      setUsers(rawUsers);
      setTotalUsers(totalFromServer);
    }
  }, [rawUsers, totalFromServer, debouncedSearch, selectedRole, statusFilter, userRolesMap]);

  useEffect(() => {
    if (rawUsers.length === 0) {
      setUserRolesMap(new Map());
      return;
    }

    let active = true;

    void (async () => {
      const results = await Promise.all(
        rawUsers.map(async (user) => {
          try {
            const assigned = (await fetchUserRoles(user.id)) as SafeRoleRecord[];
            return { userId: user.id, roles: assigned };
          } catch (error) {
            console.warn(`No se pudieron cargar los roles del usuario ${user.id}`, error);
            return { userId: user.id, roles: [] as SafeRoleRecord[] };
          }
        })
      );

      if (!active) {
        return;
      }

      const nextMap = new Map<number, RoleRecord[]>();
      results.forEach(({ userId, roles: assigned }) => {
        nextMap.set(userId, assigned);
      });
      setUserRolesMap(nextMap);
    })();

    return () => {
      active = false;
    };
  }, [rawUsers]);

  const totalPages = useMemo(() => {
    if (totalUsers === 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));
  }, [totalUsers]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const startItem = totalUsers === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem = totalUsers === 0 ? 0 : Math.min(totalUsers, startItem + users.length - 1);
  const currentPageDisplay = totalUsers === 0 ? 1 : page;
  const totalPagesDisplay = totalUsers === 0 ? 1 : totalPages;

  const selectedRoleIdsList = useMemo(() => Array.from(selectedRoleIds), [selectedRoleIds]);
  const initialRoleIdsList = useMemo(() => Array.from(initialRoleIds), [initialRoleIds]);

  const hasRoleChanges = useMemo(() => {
    if (selectedRoleIdsList.length !== initialRoleIdsList.length) {
      return true;
    }
    const initialSet = new Set(initialRoleIdsList);
    return selectedRoleIdsList.some((roleId) => !initialSet.has(roleId));
  }, [initialRoleIdsList, selectedRoleIdsList]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleRoleFilterChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedRole(event.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setStatusFilter(event.target.value as StatusFilter);
    setPage(1);
  };

  const handleClearFilters = (): void => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedRole('all');
    setStatusFilter('all');
    setPage(1);
  };

  const handlePageChange = (nextPage: number): void => {
    setPage((prev) => {
      const safePage = Math.min(Math.max(nextPage, 1), totalPages);
      return prev === safePage ? prev : safePage;
    });
  };

  const openCreateModal = (): void => {
    const defaultRole = normalizedRoles.length > 0 ? String(normalizedRoles[0].id) : '';
    setCreateValues({ ...EMPTY_CREATE_FORM, roleId: defaultRole });
    setCreateError(null);
    setActionMessage(null);
    setActionError(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = (): void => {
    if (isCreating) {
      return;
    }
    setIsCreateModalOpen(false);
  };

  const handleCreateChange = <K extends keyof CreateUserFormValues>(field: K) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const value = event.target.value as CreateUserFormValues[K];
    setCreateValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setCreateError(null);
    setActionMessage(null);
    setActionError(null);

    const trimmed = {
      nombre: createValues.nombre.trim(),
      email: createValues.email.trim(),
      password: createValues.password.trim(),
      roleId: createValues.roleId.trim(),
      telefono: createValues.telefono.trim(),
      direccion: createValues.direccion.trim(),
      estado: createValues.estado
    };

    if (!trimmed.nombre || !trimmed.email || !trimmed.password || !trimmed.roleId) {
      setCreateError('Completa los campos obligatorios.');
      return;
    }

    if (!emailRegex.test(trimmed.email)) {
      setCreateError('Ingresa un correo electrónico válido.');
      return;
    }

    const roleIdNumber = Number(trimmed.roleId);
    if (!Number.isFinite(roleIdNumber)) {
      setCreateError('Selecciona un rol válido.');
      return;
    }

    const estadoValue: 0 | 1 = trimmed.estado === '1' ? 1 : 0;

    setIsCreating(true);

    try {
      await createUser({
        nombre: trimmed.nombre,
        email: trimmed.email,
        password: trimmed.password,
        roleId: roleIdNumber,
        telefono: trimmed.telefono ? trimmed.telefono : undefined,
        direccion: trimmed.direccion ? trimmed.direccion : undefined,
        estado: estadoValue
      });

      setIsCreateModalOpen(false);
      const refreshed = await loadUsers();
      if (refreshed) {
        setActionMessage('Usuario creado correctamente.');
      } else {
        setActionError('El usuario se creó, pero no pudimos refrescar la lista.');
      }
    } catch (error) {
      if (isHttpError(error)) {
        setCreateError(error.message);
      } else if (error instanceof Error) {
        setCreateError(error.message);
      } else {
        setCreateError('No se pudo crear el usuario.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const openRoleModal = (user: UserRecord): void => {
    setRoleModalUser(user);
    const cachedRoles = userRolesMap.get(user.id) ?? [];
    const cachedIds = new Set<number>();
    cachedRoles.forEach((role) => {
      const roleId = getRoleId(role);
      if (typeof roleId === 'number') {
        cachedIds.add(roleId);
      }
    });
    setSelectedRoleIds(new Set(cachedIds));
    setInitialRoleIds(new Set(cachedIds));
    setRoleModalError(null);
    setActionMessage(null);
    setActionError(null);
    setRoleModalOpen(true);
    setRoleModalLoading(true);

    void (async () => {
      try {
        const assigned = (await fetchUserRoles(user.id)) as SafeRoleRecord[];
        const assignedIds = new Set<number>();
        assigned.forEach((role) => {
          const roleId = getRoleId(role);
          if (typeof roleId === 'number') {
            assignedIds.add(roleId);
          }
        });
        setSelectedRoleIds(new Set(assignedIds));
        setInitialRoleIds(new Set(assignedIds));
        setUserRolesMap((prev) => {
          const next = new Map(prev);
          next.set(user.id, assigned);
          return next;
        });
      } catch (error) {
        if (isHttpError(error)) {
          setRoleModalError(error.message);
        } else if (error instanceof Error) {
          setRoleModalError(error.message);
        } else {
          setRoleModalError('No se pudieron obtener los roles del usuario.');
        }
      } finally {
        setRoleModalLoading(false);
      }
    })();
  };

  const closeRoleModal = (): void => {
    if (isSavingRoles) {
      return;
    }
    setRoleModalOpen(false);
    setRoleModalUser(null);
    setRoleModalError(null);
    setSelectedRoleIds(new Set());
    setInitialRoleIds(new Set());
    setRoleModalLoading(false);
  };

  const handleRoleToggle = (roleId: number): void => {
    setSelectedRoleIds((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) {
        next.delete(roleId);
      } else {
        next.add(roleId);
      }
      return next;
    });
  };

  const handleRolesSubmit = async (): Promise<void> => {
    if (!roleModalUser) {
      return;
    }

    if (!hasRoleChanges) {
      closeRoleModal();
      return;
    }

    setIsSavingRoles(true);
    setRoleModalError(null);

    const toAssign = selectedRoleIdsList.filter((roleId) => !initialRoleIds.has(roleId));
    const toRemove = initialRoleIdsList.filter((roleId) => !selectedRoleIds.has(roleId));

    try {
      await Promise.all([
        ...toAssign.map((roleId) => assignUserRole(roleModalUser.id, roleId)),
        ...toRemove.map((roleId) => removeUserRole(roleModalUser.id, roleId))
      ]);

      const updatedRoles = await fetchUserRoles(roleModalUser.id);
      setUserRolesMap((prev) => {
        const next = new Map(prev);
        next.set(roleModalUser.id, updatedRoles);
        return next;
      });

      closeRoleModal();
      const refreshed = await loadUsers();
      if (refreshed) {
        setActionMessage('Roles actualizados correctamente.');
      } else {
        setActionError('Los roles se actualizaron, pero no pudimos refrescar la lista.');
      }
    } catch (error) {
      if (isHttpError(error)) {
        setRoleModalError(error.message);
      } else if (error instanceof Error) {
        setRoleModalError(error.message);
      } else {
        setRoleModalError('No se pudieron actualizar los roles.');
      }
    } finally {
      setIsSavingRoles(false);
    }
  };

  const handleToggleUserState = async (user: SafeUserRecord): Promise<void> => {
    const enable = !isEstadoActivo(user.estado);
    setStateToggleId(user.id);
    setActionMessage(null);
    setActionError(null);

    try {
      await toggleUserState(user.id, enable);
      const refreshed = await loadUsers();
      if (refreshed) {
        setActionMessage(enable ? 'Usuario activado correctamente.' : 'Usuario desactivado correctamente.');
      } else {
        setActionError('El estado cambió, pero no pudimos refrescar la lista.');
      }
    } catch (error) {
      if (isHttpError(error)) {
        setActionError(error.message);
      } else if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError('No se pudo actualizar el estado del usuario.');
      }
    } finally {
      setStateToggleId(null);
    }
  };

  const resetProfilePanel = useCallback(() => {
    setProfilePanelOpen(false);
    setProfilePanelUser(null);
    setProfileTabs([]);
    setActiveProfileTab(null);
    setProfileStates(buildProfileStateMap());
  }, []);

  const loadProfile = useCallback(
    async (profileType: ProfileType, userIdParam?: number): Promise<void> => {
      const userId = userIdParam ?? profilePanelUser?.id;
      if (!userId) {
        return;
      }

      const config = PROFILE_CONFIGS[profileType];

      setProfileStates((prev) => ({
        ...prev,
        [profileType]: {
          ...prev[profileType],
          status: 'loading',
          error: null,
          success: null
        }
      }));

      try {
        const profile = await config.fetch(userId);
        setProfileStates((prev) => ({
          ...prev,
          [profileType]: {
            ...prev[profileType],
            status: 'ready',
            hasProfile: true,
            form: config.toForm(profile),
            error: null
          }
        }));
      } catch (error) {
        if (isHttpError(error) && error.status === 404) {
          setProfileStates((prev) => ({
            ...prev,
            [profileType]: {
              ...prev[profileType],
              status: 'ready',
              hasProfile: false,
              form: config.buildEmptyForm(),
              error: null
            }
          }));
          return;
        }

        const message = isHttpError(error)
          ? error.message
          : error instanceof Error
            ? error.message
            : 'No se pudo cargar el perfil.';
        setProfileStates((prev) => ({
          ...prev,
          [profileType]: {
            ...prev[profileType],
            status: 'error',
            hasProfile: false,
            error: message
          }
        }));
      }
    },
    [profilePanelUser]
  );

  const getProfileTypesForUser = useCallback(
    (userId: number): ProfileType[] => {
      const rolesForUser = userRolesMap.get(userId) ?? [];
      return resolveProfileTypes(rolesForUser);
    },
    [userRolesMap]
  );

  const openProfilePanelForUser = (user: SafeUserRecord): void => {
    const availableProfiles = getProfileTypesForUser(user.id);

    if (availableProfiles.length === 0) {
      setActionError('Asigna un rol especializado (Director, Administrativo, Personal de Salud o Paciente) para gestionar el perfil.');
      return;
    }

    setProfileStates(buildProfileStateMap());
    setProfilePanelUser(user);
    setProfileTabs(availableProfiles);
    setActiveProfileTab(availableProfiles[0]);
    setProfilePanelOpen(true);

    void loadProfile(availableProfiles[0], user.id);
  };

  const handleProfileTabChange = (type: ProfileType): void => {
    if (activeProfileTab === type) {
      return;
    }
    setActiveProfileTab(type);
    if (profileStates[type].status === 'idle') {
      void loadProfile(type);
    }
  };

  const handleProfileInputChange = (type: ProfileType, field: string) => (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setProfileStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        form: { ...prev[type].form, [field]: value },
        error: null,
        success: null
      }
    }));
  };

  const validateProfileForm = (type: ProfileType): string | null => {
    const config = PROFILE_CONFIGS[type];
    const state = profileStates[type];
    const missingField = config.fields.find((field) => field.required && !(state.form[field.name]?.trim()));
    return missingField ? `Completa el campo "${missingField.label}".` : null;
  };

  const handleProfileSubmit = (type: ProfileType) => async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!profilePanelUser) {
      return;
    }

    const validationError = validateProfileForm(type);
    if (validationError) {
      setProfileStates((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          error: validationError,
          success: null
        }
      }));
      return;
    }

    const config = PROFILE_CONFIGS[type];
    const currentState = profileStates[type];

    setProfileStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        isSaving: true,
        error: null,
        success: null
      }
    }));

    try {
      const result = currentState.hasProfile
        ? await config.update(profilePanelUser.id, currentState.form)
        : await config.create(profilePanelUser.id, currentState.form);

      setProfileStates((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          isSaving: false,
          status: 'ready',
          hasProfile: true,
          form: config.toForm(result),
          success: currentState.hasProfile ? 'Perfil actualizado correctamente.' : 'Perfil creado correctamente.'
        }
      }));
    } catch (error) {
      const message = isHttpError(error)
        ? error.message
        : error instanceof Error
          ? error.message
          : 'No se pudo guardar el perfil.';
      setProfileStates((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          isSaving: false,
          error: message,
          success: null
        }
      }));
    }
  };

  const handleProfileDelete = (type: ProfileType) => async (): Promise<void> => {
    if (!profilePanelUser) {
      return;
    }

    const config = PROFILE_CONFIGS[type];
    if (!config.remove) {
      return;
    }

    setProfileStates((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        isSaving: true,
        error: null,
        success: null
      }
    }));

    try {
      await config.remove(profilePanelUser.id);
      const resetState = createEmptyProfileState(type);
      setProfileStates((prev) => ({
        ...prev,
        [type]: {
          ...resetState,
          status: 'ready',
          success: 'Perfil eliminado correctamente.'
        }
      }));
    } catch (error) {
      const message = isHttpError(error)
        ? error.message
        : error instanceof Error
          ? error.message
          : 'No se pudo eliminar el perfil.';
      setProfileStates((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          isSaving: false,
          error: message,
          success: null
        }
      }));
    }
  };

  const renderProfileSection = (type: ProfileType): React.ReactNode => {
    const config = PROFILE_CONFIGS[type];
    const state = profileStates[type];

    if (state.status === 'loading') {
      return <div className="profile-placeholder">Cargando información de {config.label}...</div>;
    }

    if (state.status === 'error') {
      return (
        <div className="profile-placeholder error">
          <p>{state.error ?? 'No se pudo cargar el perfil.'}</p>
          <button type="button" className="profile-button ghost" onClick={() => loadProfile(type)}>
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <form className="profile-form" onSubmit={handleProfileSubmit(type)}>
        <p className="profile-description">{config.description}</p>
        <div className="profile-fields">
          {config.fields.map((field) => (
            <label key={field.name} className="profile-field">
              <span>
                {field.label}
                {field.required && <sup>*</sup>}
              </span>
              <input
                type="text"
                value={state.form[field.name] ?? ''}
                onChange={handleProfileInputChange(type, field.name)}
                placeholder={field.placeholder}
                required={field.required}
                disabled={state.isSaving}
              />
              {field.helperText && <small>{field.helperText}</small>}
            </label>
          ))}
        </div>
        {state.error && <div className="profile-message error">{state.error}</div>}
        {state.success && <div className="profile-message success">{state.success}</div>}
        <div className="profile-actions">
          {config.remove && state.hasProfile && (
            <button type="button" className="profile-button danger" onClick={handleProfileDelete(type)} disabled={state.isSaving}>
              Eliminar perfil
            </button>
          )}
          <div className="profile-actions__right">
            <button type="button" className="profile-button ghost" onClick={resetProfilePanel} disabled={state.isSaving}>
              Cerrar
            </button>
            <button type="submit" className="profile-button primary" disabled={state.isSaving}>
              {state.isSaving ? 'Guardando...' : state.hasProfile ? 'Actualizar perfil' : 'Crear perfil'}
            </button>
          </div>
        </div>
      </form>
    );
  };

  const normalizedRoles = useMemo(() => {
    return roles
      .map((role) => {
        const roleId = getRoleId(role);
        if (typeof roleId !== 'number') {
          return null;
        }
        return { id: roleId, name: getRoleName(role), role };
      })
      .filter((entry): entry is { id: number; name: string; role: SafeRoleRecord } => entry !== null);
  }, [roles]);

  const roleOptions = useMemo(
    () =>
      normalizedRoles.map((entry) => (
        <option key={entry.id} value={String(entry.id)}>
          {entry.name}
        </option>
      )),
    [normalizedRoles]
  );

  const paginatedInfo = totalUsers === 0 ? 'No hay usuarios para mostrar.' : `Mostrando ${startItem} - ${endItem} de ${totalUsers}`;
  const profilePanelRoles = profilePanelUser ? userRolesMap.get(profilePanelUser.id) ?? [] : [];

  return (
    <div className="director-portal">
      <NavbarDirector />
      <div className="portal-content">
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/director/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="page-title">Gestión de Usuarios y Roles</h1>
              <p className="page-subtitle">Administra los usuarios del sistema</p>
            </div>
          </div>
        </div>

        <div className="overview-bar">
          <span className="total-usuarios">Total de usuarios: {totalUsers}</span>
          <div className="overview-actions">
            <button className="filter-reset" onClick={handleClearFilters} disabled={!searchTerm && selectedRole === 'all' && statusFilter === 'all'}>
              Limpiar filtros
            </button>
            <button className="btn-create-usuario" onClick={openCreateModal}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4V12M4 8H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Crear Usuario
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.16667 15C12.3883 15 15 12.3883 15 9.16667C15 5.945 12.3883 3.33333 9.16667 3.33333C5.945 3.33333 3.33333 5.945 3.33333 9.16667C3.33333 12.3883 5.945 15 9.16667 15Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16.6666 16.6667L13.75 13.75" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input
              type="search"
              className="search-input"
              placeholder="Buscar por nombre o correo"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="filters-group">
            <select className="filter-select" value={selectedRole} onChange={handleRoleFilterChange}>
              <option key="filter-role-all" value="all">Todos los roles</option>
              {roleOptions}
            </select>
            <select className="filter-select" value={statusFilter} onChange={handleStatusFilterChange}>
              <option key="filter-status-all" value="all">Todos los estados</option>
              <option key="filter-status-active" value="active">Activos</option>
              <option key="filter-status-inactive" value="inactive">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="table-card">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID Usuario</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Roles</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="table-placeholder">Cargando usuarios...</div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="table-placeholder">No se encontraron usuarios con los filtros seleccionados.</div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const assignedRoles = userRolesMap.get(user.id) ?? [];
                  const roleSummary =
                    assignedRoles.length > 0 ? assignedRoles.map((role) => getRoleName(role)).join(', ') : 'Sin roles asignados';
                  const estadoActivo = isEstadoActivo(user.estado);
                  const estadoClass = estadoActivo ? 'status-active' : 'status-inactive';
                  const isProcessing = stateToggleId === user.id;
                  const canManageProfiles = getProfileTypesForUser(user.id).length > 0;

                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nombre}</td>
                      <td>{user.email}</td>
                      <td>{user.telefono ?? '—'}</td>
                      <td>
                        <span className={`status-badge ${estadoClass}`}>{estadoActivo ? 'Activo' : 'Inactivo'}</span>
                      </td>
                      <td>
                        <span className="role-badge">{roleSummary}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="action-button secondary" onClick={() => openProfilePanelForUser(user)} disabled={!canManageProfiles}>
                            Perfiles
                          </button>
                          <button type="button" className="action-button" onClick={() => openRoleModal(user)}>
                            Gestionar roles
                          </button>
                          <button
                            type="button"
                            className={`action-button ${estadoActivo ? 'danger' : 'success'}`}
                            onClick={() => handleToggleUserState(user)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Procesando...' : estadoActivo ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {loadError && <div className="table-error">{loadError}</div>}
          {actionMessage && <div className="table-success">{actionMessage}</div>}
          {actionError && <div className="table-error">{actionError}</div>}

          <div className="table-pagination">
            <span className="pagination-summary">{paginatedInfo}</span>
            <div className="pagination-controls">
              <button
                className="page-button"
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                Anterior
              </button>
              <span className="pagination-page">Página {currentPageDisplay} de {totalPagesDisplay}</span>
              <button
                className="page-button"
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || totalUsers === 0}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        <div className="info-card">
          <p className="info-text">
            <strong>Recuerda:</strong> puedes activar o desactivar usuarios sin perder su histórico.
          </p>
          <p className="info-text">
            <strong>Roles disponibles:</strong> consulta el listado y asegura que cada usuario tenga los permisos correctos.
          </p>
        </div>
      </div>

      {profilePanelOpen && profilePanelUser && (
        <div className="profile-panel-backdrop" role="dialog" aria-modal="true">
          <aside className="profile-panel">
            <header className="profile-panel__header">
              <div>
                <p className="profile-panel__eyebrow">Perfiles especializados</p>
                <h2 className="profile-panel__title">{profilePanelUser.nombre}</h2>
                <p className="profile-panel__subtitle">{profilePanelUser.email ?? profilePanelUser.correo ?? 'Sin correo'}</p>
                <div className="profile-panel__meta">
                  <span>ID #{profilePanelUser.id}</span>
                  <span>{profilePanelUser.telefono ?? 'Sin teléfono'}</span>
                </div>
                <div className="profile-panel__roles">
                  {profilePanelRoles.map((role) => (
                    <span key={`${profilePanelUser.id}-${getRoleId(role) ?? getRoleName(role)}`} className="profile-role-chip">
                      {getRoleName(role)}
                    </span>
                  ))}
                </div>
              </div>
              <button type="button" className="profile-panel__close" onClick={resetProfilePanel} aria-label="Cerrar panel">
                ×
              </button>
            </header>

            <div className="profile-panel__body">
              <div className="profile-tabs" role="tablist">
                {profileTabs.map((type) => {
                  const isActive = activeProfileTab === type;
                  const state = profileStates[type];
                  return (
                    <button
                      key={type}
                      type="button"
                      role="tab"
                      className={`profile-tab ${isActive ? 'active' : ''}`}
                      aria-selected={isActive}
                      onClick={() => handleProfileTabChange(type)}
                    >
                      <span className="profile-tab__label">{PROFILE_CONFIGS[type].label}</span>
                      <span className={`profile-tab__status ${state.hasProfile ? 'ready' : ''}`}>
                        {state.hasProfile ? 'Configurado' : 'Pendiente'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="profile-panel__content">
                {activeProfileTab ? (
                  <>{renderProfileSection(activeProfileTab)}</>
                ) : (
                  <div className="profile-placeholder">Selecciona un perfil para empezar.</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">Crear usuario</h2>
              <button type="button" className="modal-close" onClick={closeCreateModal} disabled={isCreating} aria-label="Cerrar">
                ×
              </button>
            </div>
            <form className="modal-form" onSubmit={handleCreateSubmit}>
              <div className="modal-grid">
                <label className="modal-field">
                  <span>Nombre*</span>
                  <input
                    type="text"
                    value={createValues.nombre}
                    onChange={handleCreateChange('nombre')}
                    placeholder="Nombre completo"
                  />
                </label>
                <label className="modal-field">
                  <span>Correo electrónico*</span>
                  <input
                    type="email"
                    value={createValues.email}
                    onChange={handleCreateChange('email')}
                    placeholder="correo@ejemplo.com"
                  />
                </label>
                <label className="modal-field">
                  <span>Contraseña*</span>
                  <input
                    type="password"
                    value={createValues.password}
                    onChange={handleCreateChange('password')}
                    placeholder="Contraseña temporal"
                  />
                </label>
                <label className="modal-field">
                  <span>Rol asignado*</span>
                  <select value={createValues.roleId} onChange={handleCreateChange('roleId')} disabled={roles.length === 0}>
                    <option key="create-role-empty" value="">
                      Selecciona un rol
                    </option>
                    {roleOptions}
                  </select>
                </label>
                <label className="modal-field">
                  <span>Teléfono</span>
                  <input
                    type="tel"
                    value={createValues.telefono}
                    onChange={handleCreateChange('telefono')}
                    placeholder="3000000000"
                  />
                </label>
                <label className="modal-field">
                  <span>Dirección</span>
                  <input
                    type="text"
                    value={createValues.direccion}
                    onChange={handleCreateChange('direccion')}
                    placeholder="Calle 123 #45-67"
                  />
                </label>
                <label className="modal-field">
                  <span>Estado</span>
                  <select value={createValues.estado} onChange={handleCreateChange('estado')}>
                    <option key="create-status-active" value="1">Activo</option>
                    <option key="create-status-inactive" value="0">Inactivo</option>
                  </select>
                </label>
              </div>

              {createError && <div className="modal-error">{createError}</div>}

              <div className="modal-actions">
                <button type="button" className="modal-button secondary" onClick={closeCreateModal} disabled={isCreating}>
                  Cancelar
                </button>
                <button type="submit" className="modal-button primary" disabled={isCreating || roles.length === 0}>
                  {isCreating ? 'Guardando...' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {roleModalOpen && roleModalUser && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">Roles de {roleModalUser.nombre}</h2>
              <button type="button" className="modal-close" onClick={closeRoleModal} disabled={isSavingRoles} aria-label="Cerrar">
                ×
              </button>
            </div>

            {roleModalLoading ? (
              <div className="modal-placeholder">Cargando roles del usuario...</div>
            ) : (
              <div className="roles-list" role="group" aria-label="Roles disponibles">
                {normalizedRoles.length === 0 ? (
                  <p className="empty-roles">No hay roles configurados.</p>
                ) : (
                  normalizedRoles.map((entry) => (
                    <label key={entry.id} className="role-option">
                      <input
                        type="checkbox"
                        checked={selectedRoleIds.has(entry.id)}
                        onChange={() => handleRoleToggle(entry.id)}
                        disabled={isSavingRoles}
                      />
                      <div className="role-info">
                        <span className="role-name">{entry.name}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>
            )}

            {roleModalError && <div className="modal-error">{roleModalError}</div>}

            <div className="modal-actions">
              <button type="button" className="modal-button secondary" onClick={closeRoleModal} disabled={isSavingRoles}>
                Cancelar
              </button>
              <button
                type="button"
                className="modal-button primary"
                onClick={handleRolesSubmit}
                disabled={isSavingRoles || roleModalLoading || roles.length === 0}
              >
                {isSavingRoles ? 'Guardando...' : hasRoleChanges ? 'Actualizar roles' : 'Cerrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;



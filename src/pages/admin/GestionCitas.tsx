import React, { useCallback, useEffect, useMemo, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminPortal.css';
import './GestionCitas.css';
import { isHttpError } from '../../services/httpClient';
import {
  cancelarCita,
  crearCita,
  fetchCitaPorId,
  listarCitas,
  marcarCitaEnSala,
  marcarCitaNoAsistida,
  reprogramarCita,
  confirmarCita,
  eliminarCita,
  type CitaDetalle
} from '../../services/citas';
import { listarEstadosCita, type EstadoCita } from '../../services/estadosCita';

interface AppointmentRecord {
  id?: number | string;
  citaId?: number | string;
  paciente?: {
    id?: number | string;
    nombre?: string;
    apellido?: string;
    [key: string]: unknown;
  } | null;
  pacienteId?: number | string;
  pacienteNombre?: string;
  pacienteApellido?: string;
  personalSalud?: {
    id?: number | string;
    nombre?: string;
    apellido?: string;
    [key: string]: unknown;
  } | null;
  profesional?: string;
  profesionalId?: number | string;
  fecha?: string;
  hora?: string;
  estado?: string | null;
  estadoCodigo?: string | null;
  estadoCita?: Record<string, unknown> | null;
  [key: string]: unknown;
}

interface AppointmentRow {
  id: string;
  rawId: number | null;
  pacienteNombre: string;
  pacienteId: string;
  profesionalNombre: string;
  profesionalId: string;
  fecha: string;
  dateValue: string;
  hora: string;
  timeValue: string;
  estado: string;
}

const normalizeStatus = (value?: string | null): string => value?.trim() ?? '';

const resolveAppointmentStatus = (appointment: AppointmentRecord): string => {
  const primary = appointment.estadoCodigo ?? appointment.estado;
  if (primary && typeof primary === 'string') {
    return primary;
  }

  const estadoCita = appointment.estadoCita;
  if (estadoCita && typeof estadoCita === 'object') {
    const record = estadoCita as Record<string, unknown>;
    const fromNombre = record.nombre ?? record.estado;
    if (typeof fromNombre === 'string') {
      return fromNombre;
    }
  }

  if (appointment.estado && typeof appointment.estado === 'object') {
    const record = appointment.estado as Record<string, unknown>;
    const nested = record.nombre;
    if (typeof nested === 'string') {
      return nested;
    }
  }

  return '';
};

const formatTime = (value?: string): string => {
  if (!value) {
    return '';
  }
  if (/^\d{2}:\d{2}$/.test(value)) {
    return `${value}:00`;
  }
  return value;
};

const extractString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return fallback;
};

const parseNumericId = (raw: string): number | null => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  if (/^-?\d+$/.test(trimmed)) {
    const parsed = Number(trimmed);
    return Number.isInteger(parsed) ? parsed : null;
  }

  const digits = trimmed.match(/\d+/g);
  if (!digits) {
    return null;
  }

  const joined = digits.join('');
  const parsed = Number(joined);
  return Number.isInteger(parsed) ? parsed : null;
};

const formatAppointmentRow = (appointment: AppointmentRecord): AppointmentRow => {
  const idValue = appointment.id ?? appointment.citaId ?? '';
  const idString = extractString(idValue);
  const numericId = parseNumericId(idString);
  const rawDate = extractString(appointment.fecha, '');
  const normalizedDate = rawDate.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? '';
  const rawTime = extractString(appointment.hora, '');
  const normalizedTime = rawTime.match(/\d{2}:\d{2}/)?.[0] ?? (rawTime.match(/\d{2}:\d{2}:\d{2}/)?.[0] ?? '');
  const patientName = appointment.paciente
    ? `${extractString(appointment.paciente.nombre, '').trim()} ${extractString(appointment.paciente.apellido, '').trim()}`.trim()
    : `${extractString(appointment.pacienteNombre, '').trim()} ${extractString(appointment.pacienteApellido, '').trim()}`.trim();
  const professionalName = appointment.personalSalud
    ? `${extractString(appointment.personalSalud.nombre, '').trim()} ${extractString(appointment.personalSalud.apellido, '').trim()}`.trim()
    : extractString(appointment.profesional, '') || '—';

  return {
    id: idString || '—',
    rawId: numericId,
    pacienteNombre: patientName || '—',
    pacienteId: extractString(appointment.paciente?.id ?? appointment.pacienteId, '—'),
    profesionalNombre: professionalName,
    profesionalId: extractString(appointment.personalSalud?.id ?? appointment.profesionalId, '—'),
    fecha: rawDate || '—',
    dateValue: normalizedDate,
    hora: rawTime ? formatTime(rawTime) : '—',
    timeValue: normalizedTime,
    estado: normalizeStatus(resolveAppointmentStatus(appointment)) || '—'
  };
};

const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toDisplayText = (value: unknown, fallback = ''): string => {
  if (value === undefined || value === null) {
    return fallback;
  }
  const text = String(value).trim();
  return text.length ? text : fallback;
};

type GenericEntity = Record<string, unknown> | null | undefined;

const readEntityValue = (record: GenericEntity, key: string): unknown => {
  if (record && typeof record === 'object') {
    return (record as Record<string, unknown>)[key];
  }
  return undefined;
};

const formatPersonInfo = (record: GenericEntity): { name: string; id: string } => {
  const first = toDisplayText(readEntityValue(record, 'nombre'), '');
  const last = toDisplayText(readEntityValue(record, 'apellido'), '');
  const id = toDisplayText(readEntityValue(record, 'id'), '');
  const combined = `${first} ${last}`.trim();
  return {
    name: combined || first || last || '—',
    id
  };
};

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}(?::\d{2})?$/;
const PAGE_SIZE = 8;

interface CreateAppointmentValues {
  patientId: string;
  professionalId: string;
  date: string;
  time: string;
}

const EMPTY_CREATE_VALUES: CreateAppointmentValues = {
  patientId: '',
  professionalId: '',
  date: '',
  time: ''
};

interface FiltersState {
  fecha: string;
  profesionalId: string;
}

const DEFAULT_FILTERS: FiltersState = {
  fecha: getTodayDateString(),
  profesionalId: ''
};

const GestionCitas: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createValues, setCreateValues] = useState<CreateAppointmentValues>(EMPTY_CREATE_VALUES);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isReprogramModalOpen, setIsReprogramModalOpen] = useState<boolean>(false);
  const [reprogramTarget, setReprogramTarget] = useState<AppointmentRow | null>(null);
  const [reprogramValues, setReprogramValues] = useState<{ date: string; time: string }>({ date: '', time: '' });
  const [reprogramError, setReprogramError] = useState<string | null>(null);
  const [isReprogramming, setIsReprogramming] = useState<boolean>(false);
  const [statusCatalog, setStatusCatalog] = useState<Record<string, EstadoCita>>({});
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedNumericId, setSelectedNumericId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<CitaDetalle | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailAction, setDetailAction] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const loadAppointments = useCallback(
    async (options?: { signal?: AbortSignal; sourceFilters?: FiltersState }): Promise<boolean> => {
      const { signal, sourceFilters } = options ?? {};
      const criteria = sourceFilters ?? filters;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const params: { fecha?: string; profesionalId?: number } = {};
        if (criteria.fecha) {
          params.fecha = criteria.fecha;
        }
        const profesionIdNumeric = parseNumericId(criteria.profesionalId);
        if (profesionIdNumeric !== null) {
          params.profesionalId = profesionIdNumeric;
        }

        const response = await listarCitas(params, signal);
        const payload = (Array.isArray(response)
          ? response
          : response && typeof response === 'object'
            ? ((response as Record<string, unknown>).items as AppointmentRecord[]) ??
              ((response as Record<string, unknown>).data as AppointmentRecord[]) ??
              ((response as Record<string, unknown>).results as AppointmentRecord[]) ??
              []
            : []) as AppointmentRecord[];

        const mapped = payload.map((item) => formatAppointmentRow(item));
        setAppointments(mapped);

        if (selectedNumericId !== null) {
          const stillExists = mapped.some((row) => (row.rawId ?? parseNumericId(row.id)) === selectedNumericId);
          if (!stillExists) {
            setSelectedNumericId(null);
            setSelectedRowId(null);
            setSelectedDetail(null);
          }
        }

        return true;
      } catch (error) {
        if (signal?.aborted) {
          return false;
        }

        if (isHttpError(error)) {
          setErrorMessage(error.message);
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('No se pudieron cargar las citas.');
        }
        return false;
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [filters, selectedNumericId]
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadAppointments({ signal: controller.signal });
    return () => {
      controller.abort();
    };
  }, [loadAppointments]);

  useEffect(() => {
    const controller = new AbortController();
    listarEstadosCita(controller.signal)
      .then((data) => {
        const mapping: Record<string, EstadoCita> = {};
        data?.forEach((estado) => {
          const key = normalizeStatus(estado.codigo);
          if (key) {
            mapping[key] = estado;
          }
        });
        setStatusCatalog(mapping);
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }
        console.warn('No se pudieron cargar los estados de cita', error);
      });
    return () => controller.abort();
  }, []);

  const refreshDetail = useCallback(
    async (appointmentId: number, signal?: AbortSignal): Promise<void> => {
      setDetailLoading(true);
      setDetailError(null);
      try {
        const detail = await fetchCitaPorId(appointmentId, signal);
        if (!signal?.aborted) {
          setSelectedDetail(detail);
        }
      } catch (error) {
        if (signal?.aborted) {
          return;
        }
        if (isHttpError(error)) {
          setDetailError(error.message);
        } else if (error instanceof Error) {
          setDetailError(error.message);
        } else {
          setDetailError('No se pudo cargar el detalle de la cita.');
        }
      } finally {
        if (!signal?.aborted) {
          setDetailLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (selectedNumericId === null) {
      setSelectedDetail(null);
      setDetailError(null);
      return;
    }
    const controller = new AbortController();
    void refreshDetail(selectedNumericId, controller.signal);
    return () => controller.abort();
  }, [refreshDetail, selectedNumericId]);

  const runAppointmentAction = useCallback(
    async ({ appointmentId, successMessage, action }: { appointmentId: number; successMessage: string; action: () => Promise<unknown> }) => {
      setActionError(null);
      setActionSuccess(null);
      try {
        await action();
        const refreshed = await loadAppointments();
        if (selectedNumericId === appointmentId) {
          await refreshDetail(appointmentId);
        }
        setActionSuccess(refreshed ? successMessage : `${successMessage} Refresca la tabla para ver los cambios.`);
      } catch (error) {
        if (isHttpError(error)) {
          setActionError(error.message);
        } else if (error instanceof Error) {
          setActionError(error.message);
        } else {
          setActionError('Ocurrió un error inesperado al intentar procesar la cita.');
        }
      }
    },
    [loadAppointments, refreshDetail, selectedNumericId]
  );

  const citasFiltradas = useMemo(() => {
    if (!searchTerm) {
      return appointments;
    }

    const term = searchTerm.toLowerCase();
    return appointments.filter((cita) =>
      cita.id.toLowerCase().includes(term) ||
      cita.pacienteNombre.toLowerCase().includes(term) ||
      cita.profesionalNombre.toLowerCase().includes(term) ||
      cita.pacienteId.toLowerCase().includes(term)
    );
  }, [appointments, searchTerm]);

  const totalFiltered = citasFiltradas.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage((prev) => {
      const normalized = Math.min(prev, totalPages);
      return normalized === prev ? prev : normalized;
    });
  }, [totalPages]);

  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginatedCitas = useMemo(() => {
    const startIndex = (currentPageSafe - 1) * PAGE_SIZE;
    return citasFiltradas.slice(startIndex, startIndex + PAGE_SIZE);
  }, [citasFiltradas, currentPageSafe]);

  const startItem = totalFiltered === 0 ? 0 : (currentPageSafe - 1) * PAGE_SIZE + 1;
  const endItem = totalFiltered === 0 ? 0 : startItem + paginatedCitas.length - 1;

  const handlePageChange = (nextPage: number): void => {
    setCurrentPage((prev) => {
      const normalized = Math.min(Math.max(nextPage, 1), totalPages);
      return normalized === prev ? prev : normalized;
    });
  };

  const pageOptions = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openCreateModal = (): void => {
    setCreateValues(EMPTY_CREATE_VALUES);
    setCreateError(null);
    setActionSuccess(null);
    setActionError(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = (): void => {
    if (isCreating) {
      return;
    }
    setIsCreateModalOpen(false);
    setCreateError(null);
  };

  const openReprogramModal = (appointment: AppointmentRow): void => {
    setReprogramTarget(appointment);
    setReprogramValues({
      date: appointment.dateValue || '',
      time: appointment.timeValue ? appointment.timeValue.slice(0, 5) : ''
    });
    setReprogramError(null);
    setActionSuccess(null);
    setActionError(null);
    setIsReprogramModalOpen(true);
  };

  const closeReprogramModal = (): void => {
    if (isReprogramming) {
      return;
    }
    setIsReprogramModalOpen(false);
    setReprogramTarget(null);
    setReprogramValues({ date: '', time: '' });
    setReprogramError(null);
  };

  const handleReprogramChange = (field: 'date' | 'time') => (event: ChangeEvent<HTMLInputElement>): void => {
    setReprogramValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCreateChange = (field: keyof CreateAppointmentValues) => (event: ChangeEvent<HTMLInputElement>): void => {
    setCreateValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setCreateError(null);
    setActionSuccess(null);
    setActionError(null);

    const trimmed = {
      patientId: createValues.patientId.trim(),
      professionalId: createValues.professionalId.trim(),
      date: createValues.date.trim(),
      time: createValues.time.trim()
    };

    if (!trimmed.patientId || !trimmed.professionalId || !trimmed.date || !trimmed.time) {
      setCreateError('Todos los campos son obligatorios.');
      return;
    }

    if (!DATE_REGEX.test(trimmed.date)) {
      setCreateError('La fecha debe tener el formato YYYY-MM-DD.');
      return;
    }

    if (!TIME_REGEX.test(trimmed.time)) {
      setCreateError('La hora debe tener el formato HH:mm o HH:mm:ss.');
      return;
    }

    const patientNumeric = parseNumericId(trimmed.patientId);
    const professionalNumeric = parseNumericId(trimmed.professionalId);

    if (patientNumeric === null || professionalNumeric === null) {
      setCreateError('Revisa los identificadores: deben contener números válidos.');
      return;
    }

    setIsCreating(true);

    try {
      await crearCita({
        idPaciente: patientNumeric,
        idPersonalSalud: professionalNumeric,
        fecha: trimmed.date,
        hora: trimmed.time
      });

      setIsCreateModalOpen(false);
      setCreateValues(EMPTY_CREATE_VALUES);
      const refreshed = await loadAppointments();
      setActionSuccess(refreshed ? 'La cita se creó correctamente.' : 'La cita se creó, pero no pudimos refrescar la lista.');
    } catch (error) {
      if (isHttpError(error)) {
        setCreateError(error.message);
      } else if (error instanceof Error) {
        setCreateError(error.message);
      } else {
        setCreateError('No se pudo crear la cita. Intenta nuevamente.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelAppointment = async (appointment: AppointmentRow, event?: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event?.stopPropagation();
    const numericId = appointment.rawId ?? parseNumericId(appointment.id);
    if (numericId === null) {
      setActionError('No pudimos identificar el ID numérico de la cita para cancelarla.');
      return;
    }

    const confirmed = window.confirm(`¿Cancelar la cita ${appointment.id}?`);
    if (!confirmed) {
      return;
    }

    setCancellingId(appointment.id);
    setActionError(null);
    setActionSuccess(null);

    try {
      const motivo = window.prompt('Motivo de cancelación (opcional)')?.trim();
      await cancelarCita(numericId, motivo ? { motivo } : {});

      const refreshed = await loadAppointments();
      if (selectedNumericId === numericId) {
        await refreshDetail(numericId);
      }
      setActionSuccess(refreshed ? `La cita ${appointment.id} se canceló correctamente.` : 'La cita se canceló, pero no pudimos refrescar la lista.');
    } catch (error) {
      if (isHttpError(error)) {
        setActionError(error.message);
      } else if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError('No se pudo cancelar la cita. Intenta nuevamente.');
      }
    } finally {
      setCancellingId(null);
    }
  };

  const handleReprogramSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setReprogramError(null);
    setActionSuccess(null);
    setActionError(null);

    if (!reprogramTarget) {
      setReprogramError('No se encontró la cita seleccionada.');
      return;
    }

    const numericId = reprogramTarget.rawId ?? parseNumericId(reprogramTarget.id);
    const targetId = reprogramTarget.id;
    if (numericId === null) {
      setReprogramError('No pudimos identificar el ID numérico de la cita.');
      return;
    }

    const trimmedDate = reprogramValues.date.trim();
    const trimmedTime = reprogramValues.time.trim();

    if (!trimmedDate || !trimmedTime) {
      setReprogramError('La fecha y la hora son obligatorias.');
      return;
    }

    if (!DATE_REGEX.test(trimmedDate)) {
      setReprogramError('La fecha debe tener el formato YYYY-MM-DD.');
      return;
    }

    if (!TIME_REGEX.test(trimmedTime)) {
      setReprogramError('La hora debe tener el formato HH:mm o HH:mm:ss.');
      return;
    }

    setIsReprogramming(true);

    try {
      await reprogramarCita(numericId, {
        fecha: trimmedDate,
        hora: trimmedTime
      });

      setIsReprogramModalOpen(false);
      setReprogramTarget(null);
      setReprogramValues({ date: '', time: '' });

      const refreshed = await loadAppointments();
      if (selectedNumericId === numericId) {
        await refreshDetail(numericId);
      }
      setActionSuccess(refreshed ? `La cita ${targetId} se reprogramó correctamente.` : 'La cita se reprogramó, pero no pudimos refrescar la lista.');
    } catch (error) {
      if (isHttpError(error)) {
        setReprogramError(error.message);
      } else if (error instanceof Error) {
        setReprogramError(error.message);
      } else {
        setReprogramError('No se pudo reprogramar la cita. Intenta nuevamente.');
      }
    } finally {
      setIsReprogramming(false);
    }
  };

  const handleRowClick = (appointment: AppointmentRow): void => {
    const numericId = appointment.rawId ?? parseNumericId(appointment.id);
    if (numericId === null) {
      setDetailError('No pudimos obtener el detalle de esta cita.');
      return;
    }
    setSelectedRowId(appointment.id);
    setSelectedNumericId(numericId);
  };

  const currentSelectedRow = useMemo(() => appointments.find((row) => row.id === selectedRowId) ?? null, [appointments, selectedRowId]);

  const handleFiltersSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFilters(pendingFilters);
  };

  const handleFilterChange = (field: keyof FiltersState) => (event: ChangeEvent<HTMLInputElement>): void => {
    setPendingFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleClearFilters = (): void => {
    setPendingFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
  };

  const handleConfirmSelected = async (): Promise<void> => {
    if (!selectedNumericId) return;
    setDetailAction('confirm');
    try {
      await runAppointmentAction({
        appointmentId: selectedNumericId,
        successMessage: 'La cita fue confirmada.',
        action: () => confirmarCita(selectedNumericId)
      });
    } finally {
      setDetailAction(null);
    }
  };

  const handleCheckInSelected = async (): Promise<void> => {
    if (!selectedNumericId) return;
    setDetailAction('checkin');
    try {
      await runAppointmentAction({
        appointmentId: selectedNumericId,
        successMessage: 'El paciente fue marcado en sala.',
        action: () => marcarCitaEnSala(selectedNumericId)
      });
    } finally {
      setDetailAction(null);
    }
  };

  const handleNoShowSelected = async (): Promise<void> => {
    if (!selectedNumericId) return;
    setDetailAction('noshow');
    try {
      await runAppointmentAction({
        appointmentId: selectedNumericId,
        successMessage: 'La cita se marcó como no asistida.',
        action: () => marcarCitaNoAsistida(selectedNumericId)
      });
    } finally {
      setDetailAction(null);
    }
  };

  const handleDeleteSelected = async (): Promise<void> => {
    if (!selectedNumericId || !currentSelectedRow) return;
    const confirmed = window.confirm(`¿Eliminar definitivamente la cita ${currentSelectedRow.id}?`);
    if (!confirmed) return;
    setDetailAction('delete');
    try {
      await runAppointmentAction({
        appointmentId: selectedNumericId,
        successMessage: 'La cita fue eliminada.',
        action: () => eliminarCita(selectedNumericId)
      });
      setSelectedNumericId(null);
      setSelectedRowId(null);
    } finally {
      setDetailAction(null);
    }
  };

  const statusLabelFor = useCallback(
    (status: string): { label: string; color?: string } => {
      const key = normalizeStatus(status);
      const meta = statusCatalog[key];
      if (meta) {
        return { label: meta.nombre, color: meta.colorHex };
      }
      if (!status) {
        return { label: '—' };
      }
      const pretty = status.replace(/_/g, ' ');
      return { label: pretty.charAt(0).toUpperCase() + pretty.slice(1) };
    },
    [statusCatalog]
  );

  const openReprogramFromDetail = (): void => {
    if (currentSelectedRow) {
      openReprogramModal(currentSelectedRow);
    }
  };

  const pacienteInfo = selectedDetail ? formatPersonInfo(selectedDetail.paciente) : null;
  const profesionalInfo = selectedDetail ? formatPersonInfo(selectedDetail.profesional) : null;

  return (
    <div className="admin-portal">
      <NavbarAdmin />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="page-title">Gestión de Citas</h1>
              <p className="page-subtitle">Administra todas las citas del sistema</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <form className="filters-card" onSubmit={handleFiltersSubmit}>
          <div className="filter-field">
            <span>Fecha</span>
            <input type="date" value={pendingFilters.fecha} onChange={handleFilterChange('fecha')} />
          </div>
          <div className="filter-field">
            <span>ID Profesional</span>
            <input
              type="text"
              value={pendingFilters.profesionalId}
              onChange={handleFilterChange('profesionalId')}
              placeholder="Ej. 45 o PS-045"
            />
          </div>
          <div className="filter-actions">
            <button type="submit" className="btn-filter primary">Aplicar</button>
            <button type="button" className="btn-filter ghost" onClick={handleClearFilters}>Limpiar</button>
          </div>
        </form>

        {/* Barra de búsqueda y botón de creación */}
        <div className="search-bar">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.5 17.5L13.875 13.875" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por ID, paciente, profesional...."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button type="button" className="btn-create" onClick={openCreateModal}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4V12M4 8H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Crear Cita
          </button>
        </div>

        <div className="citas-content-grid">
          {/* Tabla de citas */}
          <div className="table-card">
            <table className="citas-table">
            <thead>
              <tr>
                <th>ID Cita</th>
                <th>Paciente (ID)</th>
                <th>Personal Salud (ID)</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="table-placeholder">Cargando citas…</td>
                </tr>
              )}

              {!isLoading && citasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-placeholder">No encontramos citas con los criterios seleccionados.</td>
                </tr>
              )}

              {!isLoading && paginatedCitas.map((cita) => {
                const statusKey = cita.estado.toLowerCase();
                const isCancelling = cancellingId === cita.id;
                const { label: statusLabel, color } = statusLabelFor(cita.estado);
                const statusClass =
                  statusKey === 'confirmada'
                    ? 'status-confirmed'
                    : statusKey === 'pendiente'
                    ? 'status-pending'
                    : statusKey === 'ensala'
                    ? 'status-inroom'
                    : statusKey === 'cancelada'
                    ? 'status-cancelled'
                    : 'status-neutral';

                return (
                  <tr
                    key={cita.id}
                    className={selectedRowId === cita.id ? 'row-selected' : ''}
                    onClick={() => handleRowClick(cita)}
                  >
                  <td>{cita.id}</td>
                  <td>
                    <div className="cell-two-lines">
                      <div className="cell-line-1">{cita.pacienteNombre}</div>
                      <div className="cell-line-2">ID: {cita.pacienteId}</div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-two-lines">
                      <div className="cell-line-1">{cita.profesionalNombre}</div>
                      <div className="cell-line-2">{cita.profesionalId}</div>
                    </div>
                  </td>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>
                    <span className={`status-badge ${statusClass}`} style={color ? { backgroundColor: color, color: '#fff' } : undefined}>
                      {statusLabel}
                    </span>
                  </td>
                  <td>
                    <div className="action-links">
                      <button
                        type="button"
                        className="link-edit"
                        onClick={(event) => {
                          event.stopPropagation();
                          openReprogramModal(cita);
                        }}
                        disabled={isReprogramming && reprogramTarget?.id === cita.id}
                      >
                        {isReprogramming && reprogramTarget?.id === cita.id ? 'Reprogramando…' : 'Reprogramar'}
                      </button>
                      <button
                        type="button"
                        className="link-cancel"
                        onClick={(event) => void handleCancelAppointment(cita, event)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Cancelando…' : 'Cancelar'}
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

          {/* Panel detalle */}
          <aside className="detail-panel">
            <h2>Detalle de la cita</h2>
            {!selectedRowId && <p className="detail-placeholder">Selecciona una cita de la tabla para ver su detalle.</p>}
            {selectedRowId && (
              <>
                {detailLoading && <p className="detail-placeholder">Cargando detalle…</p>}
                {detailError && <p className="detail-error">{detailError}</p>}
                {!detailLoading && !detailError && selectedDetail && (
                  <div className="detail-content">
                    <div className="detail-grid">
                      <div className="detail-block">
                        <span className="detail-label">Cita</span>
                        <strong className="detail-value">#{selectedDetail.id}</strong>
                      </div>
                      <div className="detail-block">
                        <span className="detail-label">Estado</span>
                        <span className="detail-chip">{statusLabelFor(String(selectedDetail.estado ?? '')).label}</span>
                      </div>
                      <div className="detail-block">
                        <span className="detail-label">Fecha</span>
                        <span className="detail-value">{selectedDetail.fecha}</span>
                      </div>
                      <div className="detail-block">
                        <span className="detail-label">Hora</span>
                        <span className="detail-value">{selectedDetail.hora}</span>
                      </div>
                      <div className="detail-block">
                        <span className="detail-label">Paciente</span>
                        <span className="detail-value">{pacienteInfo?.name ?? '—'}</span>
                        {pacienteInfo?.id && <span className="detail-subvalue">ID: {pacienteInfo.id}</span>}
                      </div>
                      <div className="detail-block">
                        <span className="detail-label">Profesional</span>
                        <span className="detail-value">{profesionalInfo?.name ?? '—'}</span>
                        {profesionalInfo?.id && <span className="detail-subvalue">ID: {profesionalInfo.id}</span>}
                      </div>
                      {selectedDetail.motivo && (
                        <div className="detail-block full">
                          <span className="detail-label">Motivo</span>
                          <p className="detail-text">{String(selectedDetail.motivo)}</p>
                        </div>
                      )}
                      {selectedDetail.notas && (
                        <div className="detail-block full">
                          <span className="detail-label">Notas</span>
                          <p className="detail-text">{String(selectedDetail.notas)}</p>
                        </div>
                      )}
                    </div>

                    <div className="detail-actions">
                      <button
                        type="button"
                        className="detail-btn primary"
                        onClick={handleConfirmSelected}
                        disabled={!selectedNumericId || detailAction === 'confirm'}
                      >
                        {detailAction === 'confirm' ? 'Confirmando…' : 'Confirmar'}
                      </button>
                      <button
                        type="button"
                        className="detail-btn outline"
                        onClick={openReprogramFromDetail}
                        disabled={!currentSelectedRow}
                      >
                        Reprogramar
                      </button>
                      <button
                        type="button"
                        className="detail-btn neutral"
                        onClick={handleCheckInSelected}
                        disabled={!selectedNumericId || detailAction === 'checkin'}
                      >
                        {detailAction === 'checkin' ? 'Marcando…' : 'Check-in'}
                      </button>
                      <button
                        type="button"
                        className="detail-btn warn"
                        onClick={handleNoShowSelected}
                        disabled={!selectedNumericId || detailAction === 'noshow'}
                      >
                        {detailAction === 'noshow' ? 'Aplicando…' : 'No asistió'}
                      </button>
                      <button
                        type="button"
                        className="detail-btn danger"
                        onClick={handleDeleteSelected}
                        disabled={!selectedNumericId || detailAction === 'delete'}
                      >
                        {detailAction === 'delete' ? 'Eliminando…' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>

        {!isLoading && totalFiltered > PAGE_SIZE && (
          <div className="table-pagination">
            <div className="pagination-summary">
              {totalFiltered === 0
                ? 'No hay citas para mostrar.'
                : `Mostrando ${startItem} - ${endItem} de ${totalFiltered} citas · Página ${currentPageSafe} de ${totalPages}`}
            </div>
            <div className="pagination-controls">
              <button
                type="button"
                className="page-button"
                onClick={() => handlePageChange(currentPageSafe - 1)}
                disabled={currentPageSafe === 1}
              >
                Anterior
              </button>
              <select
                className="pagination-select"
                value={currentPageSafe}
                onChange={(event) => handlePageChange(Number(event.target.value))}
              >
                {pageOptions.map((pageNumber) => (
                  <option key={pageNumber} value={pageNumber}>
                    Página {pageNumber}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="page-button"
                onClick={() => handlePageChange(currentPageSafe + 1)}
                disabled={currentPageSafe === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {actionSuccess && (
          <div className="table-success">{actionSuccess}</div>
        )}
        {actionError && (
          <div className="table-error">{actionError}</div>
        )}
        {errorMessage && (
          <div className="table-error">{errorMessage}</div>
        )}
      </div>

      {isCreateModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">Crear Cita</h2>
              <button type="button" className="modal-close" onClick={closeCreateModal} disabled={isCreating} aria-label="Cerrar">
                ×
              </button>
            </div>
            <form className="modal-form" onSubmit={handleCreateSubmit}>
              <div className="modal-grid">
                <label className="modal-field">
                  <span>ID Paciente</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={createValues.patientId}
                    onChange={handleCreateChange('patientId')}
                    placeholder="Ej. 123 o USR-123"
                    required
                  />
                </label>
                <label className="modal-field">
                  <span>ID Personal de Salud</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={createValues.professionalId}
                    onChange={handleCreateChange('professionalId')}
                    placeholder="Ej. 45 o PS-045"
                    required
                  />
                </label>
                <label className="modal-field">
                  <span>Fecha</span>
                  <input
                    type="date"
                    value={createValues.date}
                    onChange={handleCreateChange('date')}
                    required
                  />
                </label>
                <label className="modal-field">
                  <span>Hora</span>
                  <input
                    type="time"
                    step="60"
                    value={createValues.time}
                    onChange={handleCreateChange('time')}
                    required
                  />
                </label>
              </div>

              {createError && <div className="modal-error">{createError}</div>}

              <div className="modal-actions">
                <button type="button" className="modal-button secondary" onClick={closeCreateModal} disabled={isCreating}>
                  Cancelar
                </button>
                <button type="submit" className="modal-button primary" disabled={isCreating}>
                  {isCreating ? 'Creando…' : 'Crear Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReprogramModalOpen && reprogramTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">Reprogramar Cita</h2>
              <button
                type="button"
                className="modal-close"
                onClick={closeReprogramModal}
                disabled={isReprogramming}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <form className="modal-form" onSubmit={handleReprogramSubmit}>
              <div className="modal-grid">
                <label className="modal-field">
                  <span>Nueva Fecha</span>
                  <input
                    type="date"
                    value={reprogramValues.date}
                    onChange={handleReprogramChange('date')}
                    required
                  />
                </label>
                <label className="modal-field">
                  <span>Nueva Hora</span>
                  <input
                    type="time"
                    step="60"
                    value={reprogramValues.time}
                    onChange={handleReprogramChange('time')}
                    required
                  />
                </label>
              </div>

              {reprogramError && <div className="modal-error">{reprogramError}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-button secondary"
                  onClick={closeReprogramModal}
                  disabled={isReprogramming}
                >
                  Cancelar
                </button>
                <button type="submit" className="modal-button primary" disabled={isReprogramming}>
                  {isReprogramming ? 'Reprogramando…' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCitas;



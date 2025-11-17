import React, { useCallback, useMemo, useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminPortal.css';
import './GestionCitas.css';
import './Checkin.css';
import { listarCitas, marcarCitaEnSala, marcarCitaNoAsistida, type CitaDetalle } from '../../services/citas';
import { buscarPacientePorCorreo, type PacienteResumen } from '../../services/pacientes';
import { isHttpError } from '../../services/httpClient';

const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toDisplayText = (value: unknown, fallback = '—'): string => {
  if (value === undefined || value === null) {
    return fallback;
  }
  const text = String(value).trim();
  return text.length ? text : fallback;
};

const toDateFromCita = (cita: CitaDetalle): Date | null => {
  if (!cita?.fecha) {
    return null;
  }
  const datePart = cita.fecha.includes('T') ? cita.fecha : `${cita.fecha}T${cita.hora ?? '00:00:00'}`;
  const parsed = new Date(datePart);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const sortCitas = (citas: CitaDetalle[]): CitaDetalle[] => {
  return [...citas].sort((a, b) => {
    const dateA = toDateFromCita(a)?.getTime() ?? 0;
    const dateB = toDateFromCita(b)?.getTime() ?? 0;
    return dateA - dateB;
  });
};

const filterUpcomingCitas = (citas: CitaDetalle[]): CitaDetalle[] => {
  const startOfDay = new Date(getTodayDateString());
  startOfDay.setHours(0, 0, 0, 0);
  return citas.filter((cita) => {
    const citaDate = toDateFromCita(cita);
    if (!citaDate) {
      return true;
    }
    return citaDate.getTime() >= startOfDay.getTime() - 60 * 60 * 1000; // tolerancia 1h
  });
};

const formatDate = (value?: string): string => {
  if (!value) {
    return '—';
  }
  const match = value.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : value;
};

const formatTime = (value?: string): string => {
  if (!value) {
    return '—';
  }
  const match = value.match(/\d{2}:\d{2}/);
  return match ? `${match[0]}${match[0].length === 5 ? ':00' : ''}` : value;
};

const resolveEstadoTexto = (estado?: string | Record<string, unknown> | null): string => {
  if (typeof estado === 'string') {
    return estado;
  }
  if (estado && typeof estado === 'object') {
    const record = estado as Record<string, unknown>;
    const nested = record.nombre ?? record.estado ?? record.descripcion ?? record.codigo;
    if (typeof nested === 'string') {
      return nested;
    }
  }
  return '';
};

const normalizeEstado = (estado?: string | Record<string, unknown> | null): string => {
  const texto = resolveEstadoTexto(estado);
  if (!texto) {
    return 'SIN ESTADO';
  }
  return texto.replace(/_/g, ' ').toUpperCase();
};

const estadoToBadge = (estado?: string | Record<string, unknown> | null): string => {
  const normalized = resolveEstadoTexto(estado).toLowerCase();
  if (normalized.includes('confirm') || normalized.includes('program')) {
    return 'status-badge status-confirmed';
  }
  if (normalized.includes('sala') || normalized.includes('check')) {
    return 'status-badge status-pending';
  }
  if (normalized.includes('cancel') || normalized.includes('no')) {
    return 'status-badge status-cancelled';
  }
  return 'status-badge';
};

const getProfesionalNombre = (cita: CitaDetalle): string => {
  const profesional = cita?.profesional;
  if (profesional && typeof profesional === 'object') {
    const record = profesional as Record<string, unknown>;
    const name = `${toDisplayText(record.nombre, '')} ${toDisplayText(record.apellido, '')}`.trim();
    if (name) {
      return name;
    }
  }
  const fallback = toDisplayText((cita as Record<string, unknown>).profesionalNombre ?? (cita as Record<string, unknown>).profesional, '');
  return fallback || 'Sin profesional asignado';
};

const Checkin: React.FC = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState<string>('');
  const [paciente, setPaciente] = useState<PacienteResumen | null>(null);
  const [citas, setCitas] = useState<CitaDetalle[]>([]);
  const [selectedCitaId, setSelectedCitaId] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<'checkin' | 'noshow' | null>(null);

  const selectedCita = useMemo(() => {
    if (!selectedCitaId) {
      return citas[0] ?? null;
    }
    return citas.find((cita) => cita.id === selectedCitaId) ?? citas[0] ?? null;
  }, [citas, selectedCitaId]);

  const runSearch = useCallback(
    async (email: string): Promise<void> => {
      setIsSearching(true);
      setSearchError(null);
      setActionMessage(null);
      setActionError(null);
      setCitas([]);
      setSelectedCitaId(null);
      try {
        const pacienteResult = await buscarPacientePorCorreo(email);
        if (!pacienteResult) {
          setPaciente(null);
          setSearchError('No encontramos un paciente con ese correo. Valida la información.');
          return;
        }
        setPaciente(pacienteResult);
        const citasResult = await listarCitas({ pacienteId: pacienteResult.id });
        const upcoming = filterUpcomingCitas(citasResult);
        const ordered = sortCitas(upcoming);
        setCitas(ordered);
        setSelectedCitaId(ordered[0]?.id ?? null);
        if (ordered.length === 0) {
          setSearchError('El paciente no tiene citas pendientes para hoy.');
        }
      } catch (error) {
        setPaciente(null);
        setCitas([]);
        if (isHttpError(error)) {
          if (error.status === 404) {
            setSearchError('No encontramos registros para este correo.');
          } else {
            setSearchError(error.message);
          }
        } else if (error instanceof Error) {
          setSearchError(error.message);
        } else {
          setSearchError('No pudimos completar la búsqueda.');
        }
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  const handleBuscar = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!correo.trim()) {
      setSearchError('Ingresa un correo para continuar.');
      return;
    }
    void runSearch(correo.trim());
  };

  const handleCorreoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCorreo(event.target.value);
  };

  const refreshCitas = useCallback(async (): Promise<void> => {
    if (!paciente) {
      return;
    }
    try {
      const citasResult = await listarCitas({ pacienteId: paciente.id });
      const ordered = sortCitas(filterUpcomingCitas(citasResult));
      setCitas(ordered);
      if (!ordered.some((cita) => cita.id === selectedCitaId)) {
        setSelectedCitaId(ordered[0]?.id ?? null);
      }
    } catch (error) {
      console.warn('No se pudieron refrescar las citas tras la acción', error);
    }
  }, [paciente, selectedCitaId]);

  const handleRunAction = async (cita: CitaDetalle, action: 'checkin' | 'noshow'): Promise<void> => {
    setActionLoading(action);
    setActionError(null);
    setActionMessage(null);
    try {
      if (action === 'checkin') {
        await marcarCitaEnSala(cita.id);
        setActionMessage('Check-in registrado correctamente.');
      } else {
        await marcarCitaNoAsistida(cita.id);
        setActionMessage('La cita fue marcada como no asistida.');
      }
      await refreshCitas();
    } catch (error) {
      if (isHttpError(error)) {
        if (error.status === 403) {
          setActionError('No tienes permisos para actualizar este registro.');
        } else if (error.status === 404) {
          setActionError('La cita ya no está disponible.');
        } else {
          setActionError(error.message);
        }
      } else if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError('No pudimos aplicar el cambio.');
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="admin-portal">
      <NavbarAdmin />
      <div className="portal-content">
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="page-title">Check-in Recepción</h1>
              <p className="page-subtitle">Registra la llegada de pacientes y mantén la sala sincronizada.</p>
            </div>
          </div>
        </div>

        <div className="search-patient-card">
          <h2 className="search-card-title">Buscar Paciente</h2>
          <form onSubmit={handleBuscar} className="search-patient-form">
            <div className="form-group">
              <label htmlFor="correo" className="form-label">
                Correo del paciente
              </label>
              <div className="search-input-row">
                <input
                  type="email"
                  id="correo"
                  className="search-input"
                  placeholder="nombre@dominio.com"
                  value={correo}
                  onChange={handleCorreoChange}
                />
                <button type="submit" className="btn-search" disabled={isSearching}>
                  {isSearching ? 'Buscando…' : 'Buscar'}
                </button>
              </div>
            </div>
          </form>
          {searchError && <div className="table-error">{searchError}</div>}
        </div>

        {paciente && (
          <div className="checkin-results">
            <div className="patient-summary-card">
              <div>
                <p className="summary-label">Paciente</p>
                <p className="summary-title">{`${paciente.nombre ?? ''} ${paciente.apellido ?? ''}`.trim() || 'Sin nombre registrado'}</p>
                <p className="summary-subtitle">Correo: {paciente.correo ?? '—'}</p>
              </div>
              <div className="summary-grid">
                <div>
                  <p className="summary-label">Teléfono</p>
                  <p className="summary-value">{paciente.telefono ?? 'No registrado'}</p>
                </div>
                <div>
                  <p className="summary-label">Documento</p>
                  <p className="summary-value">{paciente.documento ?? 'No registrado'}</p>
                </div>
              </div>
            </div>

            <div className="appointments-panel">
              <div className="appointments-list">
                <div className="appointments-header">
                  <h3>Citas pendientes</h3>
                  <span className="table-counter">{citas.length}</span>
                </div>
                {citas.length === 0 && <div className="appointments-empty">No hay citas programadas.</div>}
                {citas.map((cita) => {
                  const isActive = selectedCita?.id === cita.id;
                  return (
                    <button
                      key={cita.id}
                      type="button"
                      className={`appointment-item ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedCitaId(cita.id)}
                    >
                        <div className="appointment-item-body">
                          <div>
                            <p className="appointment-date">{formatDate(cita.fecha)}</p>
                            <p className="appointment-time">{formatTime(cita.hora)}</p>
                          </div>
                          <div className="appointment-meta">
                            <p>{getProfesionalNombre(cita)}</p>
                            <p className={estadoToBadge(cita.estado)}>{normalizeEstado(cita.estado)}</p>
                          </div>
                        </div>
                    </button>
                  );
                })}
              </div>

              {selectedCita && (
                <div className="appointment-detail-card">
                  <div className="detail-row">
                    <span className="detail-label">ID Cita</span>
                    <span className="detail-value">{selectedCita.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Profesional</span>
                    <span className="detail-value">{getProfesionalNombre(selectedCita)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Horario</span>
                    <span className="detail-value">
                      {formatDate(selectedCita.fecha)} · {formatTime(selectedCita.hora)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Estado actual</span>
                    <span className={`detail-status ${estadoToBadge(selectedCita.estado)}`}>{normalizeEstado(selectedCita.estado)}</span>
                  </div>
                  <div className="checkin-actions">
                    <button
                      type="button"
                      className="btn-checkin"
                      onClick={() => handleRunAction(selectedCita, 'checkin')}
                      disabled={actionLoading === 'checkin'}
                    >
                      {actionLoading === 'checkin' ? 'Registrando…' : 'Confirmar check-in'}
                    </button>
                    <button
                      type="button"
                      className="btn-no-show"
                      onClick={() => handleRunAction(selectedCita, 'noshow')}
                      disabled={actionLoading === 'noshow'}
                    >
                      {actionLoading === 'noshow' ? 'Actualizando…' : 'Marcar no asistió'}
                    </button>
                  </div>
                  {actionError && <div className="table-error">{actionError}</div>}
                  {actionMessage && <div className="table-success">{actionMessage}</div>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkin;



import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import '../../styles/PatientPortal.css';
import './MisCitas.css';
import {
  listarMisCitas,
  fetchCitaPorId,
  marcarCitaEnSala,
  cancelarCita,
  type CitaDetalle
} from '../../services/citas';
import { isHttpError } from '../../services/httpClient';

const toDateFromCita = (cita: CitaDetalle): Date | null => {
  if (!cita?.fecha) {
    return null;
  }
  const base = cita.fecha.includes('T') ? cita.fecha : `${cita.fecha}T${cita.hora ?? '00:00:00'}`;
  const parsed = new Date(base);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const sortCitas = (citas: CitaDetalle[]): CitaDetalle[] => {
  return [...citas].sort((a, b) => {
    const dateA = toDateFromCita(a)?.getTime() ?? 0;
    const dateB = toDateFromCita(b)?.getTime() ?? 0;
    return dateA - dateB;
  });
};

const normalizeEstado = (estado?: string | Record<string, unknown>): string => {
  if (typeof estado === 'string') {
    return estado.replace(/_/g, ' ').toUpperCase();
  }
  if (estado && typeof estado === 'object') {
    const label = estado.nombre ?? estado.estado ?? estado.descripcion;
    if (typeof label === 'string') {
      return label.replace(/_/g, ' ').toUpperCase();
    }
  }
  return 'SIN ESTADO';
};

const estadoToBadge = (estado?: string | Record<string, unknown>): string => {
  const raw = typeof estado === 'string'
    ? estado.toLowerCase()
    : typeof estado === 'object' && estado
      ? String(estado.nombre ?? estado.estado ?? '').toLowerCase()
      : '';

  if (raw.includes('confirm') || raw.includes('program') || raw.includes('pend')) {
    return 'status-badge status-confirmed';
  }
  if (raw.includes('sala') || raw.includes('check')) {
    return 'status-badge status-pending';
  }
  if (raw.includes('cancel') || raw.includes('no as') || raw.includes('ausente')) {
    return 'status-badge status-cancelled';
  }
  return 'status-badge';
};

const formatDate = (value?: string): string => {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (value?: string): string => {
  if (!value) {
    return '—';
  }
  const match = value.match(/\d{2}:\d{2}/);
  return match ? match[0] : value;
};

const getProfesionalNombre = (cita: CitaDetalle | null): string => {
  if (!cita) {
    return 'Por asignar';
  }
  const profesional = cita.profesional;
  if (profesional && typeof profesional === 'object') {
    const record = profesional as Record<string, unknown>;
    const nombre = `${record.nombre ?? ''} ${record.apellido ?? ''}`.trim();
    if (nombre) {
      return nombre;
    }
  }
  const fallback = (cita as Record<string, unknown>).profesionalNombre;
  return typeof fallback === 'string' && fallback.trim().length > 0 ? fallback : 'Por asignar';
};

const getEspecialidad = (cita: CitaDetalle | null): string => {
  if (!cita) {
    return '';
  }
  const fromField = (cita as Record<string, unknown>).especialidad;
  if (typeof fromField === 'string' && fromField.trim().length > 0) {
    return fromField;
  }
  const profesional = cita.profesional;
  if (profesional && typeof profesional === 'object') {
    const especialidad = (profesional as Record<string, unknown>).especialidad;
    if (typeof especialidad === 'string' && especialidad.trim().length > 0) {
      return especialidad;
    }
  }
  return '';
};

const getSede = (cita: CitaDetalle | null): string => {
  if (!cita) {
    return 'Pendiente de asignar';
  }
  const sede = (cita as Record<string, unknown>).sede;
  if (typeof sede === 'string' && sede.trim()) {
    return sede;
  }
  if (sede && typeof sede === 'object') {
    const nombre = (sede as Record<string, unknown>).nombre;
    if (typeof nombre === 'string') {
      return nombre;
    }
  }
  return 'Pendiente de asignar';
};

const canPerformCheckIn = (cita: CitaDetalle | null): boolean => {
  if (!cita) {
    return false;
  }
  const estado = normalizeEstado(cita.estado).toLowerCase();
  return !(estado.includes('cancel') || estado.includes('atendi') || estado.includes('no asis') || estado.includes('sala'));
};

const canCancel = (cita: CitaDetalle | null): boolean => {
  if (!cita) {
    return false;
  }
  const estado = normalizeEstado(cita.estado).toLowerCase();
  return !(estado.includes('cancel') || estado.includes('atendi') || estado.includes('no asis'));
};

const MisCitas: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'proximas' | 'pasadas'>('proximas');
  const [citas, setCitas] = useState<CitaDetalle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCita, setSelectedCita] = useState<CitaDetalle | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<'checkin' | 'cancel' | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  const upsertCita = useCallback((updated: CitaDetalle) => {
    setCitas((prev) => {
      const exists = prev.some((cita) => cita.id === updated.id);
      if (exists) {
        return prev.map((cita) => (cita.id === updated.id ? { ...cita, ...updated } : cita));
      }
      return sortCitas([...prev, updated]);
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadCitas = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await listarMisCitas(controller.signal);
        setCitas(sortCitas(response));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        if (isHttpError(error)) {
          if (error.status === 403) {
            setErrorMessage('Tu rol actual no puede consultar /citas/mias. Inicia sesión como paciente.');
          } else {
            setErrorMessage(error.message);
          }
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('No pudimos cargar tus citas.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadCitas();
    return () => controller.abort();
  }, []);

  const proximas = useMemo(() => {
    const now = Date.now();
    return sortCitas(citas).filter((cita) => {
      const citaDate = toDateFromCita(cita);
      if (!citaDate) {
        return true;
      }
      return citaDate.getTime() >= now;
    });
  }, [citas]);

  const pasadas = useMemo(() => {
    const now = Date.now();
    return sortCitas(citas).filter((cita) => {
      const citaDate = toDateFromCita(cita);
      return citaDate !== null && citaDate.getTime() < now;
    });
  }, [citas]);

  const citasVisibles = activeTab === 'proximas' ? proximas : pasadas;

  const openDetailModal = async (cita: CitaDetalle): Promise<void> => {
    setIsModalOpen(true);
    setSelectedCita(cita);
    setActionError(null);
    setCancelReason('');
    setIsDetailLoading(true);
    try {
      const detail = await fetchCitaPorId(cita.id);
      setSelectedCita(detail);
      upsertCita(detail);
    } catch (error) {
      if (isHttpError(error)) {
        setActionError(error.message);
      } else if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError('No pudimos obtener el detalle de la cita.');
      }
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedCita(null);
    setActionLoading(null);
    setActionError(null);
    setCancelReason('');
  };

  const handleCheckIn = async (): Promise<void> => {
    if (!selectedCita) {
      return;
    }
    setActionLoading('checkin');
    setActionError(null);
    try {
      const updated = await marcarCitaEnSala(selectedCita.id);
      setSelectedCita(updated);
      upsertCita(updated);
    } catch (error) {
      if (isHttpError(error)) {
        setActionError(error.message);
      } else if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError('No pudimos registrar tu check-in.');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (): Promise<void> => {
    if (!selectedCita) {
      return;
    }
    setActionLoading('cancel');
    setActionError(null);
    try {
      const updated = await cancelarCita(selectedCita.id, cancelReason ? { motivo: cancelReason } : {});
      setSelectedCita(updated);
      upsertCita(updated);
    } catch (error) {
      if (isHttpError(error)) {
        setActionError(error.message);
      } else if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError('No pudimos cancelar tu cita.');
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="patient-portal">
      <Navbar />
      <div className="portal-content">
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="page-title">Mis Citas</h1>
              <p className="page-subtitle">Gestiona tus citas médicas</p>
            </div>
          </div>
        </div>

        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'proximas' ? 'active' : ''}`}
            onClick={() => setActiveTab('proximas')}
          >
            Próximas ({proximas.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'pasadas' ? 'active' : ''}`}
            onClick={() => setActiveTab('pasadas')}
          >
            Pasadas ({pasadas.length})
          </button>
        </div>

        {errorMessage && <div className="alert error">{errorMessage}</div>}

        <div className="citas-list">
          {isLoading && (
            <div className="cita-card loading">Cargando tus citas…</div>
          )}

          {!isLoading && citasVisibles.length === 0 && (
            <div className="empty-state">
              {activeTab === 'proximas' ? 'No tienes citas programadas.' : 'No hay citas en tu historial reciente.'}
            </div>
          )}

          {!isLoading && citasVisibles.map((cita) => (
            <div key={cita.id} className="cita-card">
              <div className="cita-header">
                <div>
                  <span className="cita-especialidad">{getEspecialidad(cita) || 'Consulta médica'}</span>
                  <div className="cita-subtitle">{getProfesionalNombre(cita)}</div>
                </div>
                <span className={estadoToBadge(cita.estado)}>{normalizeEstado(cita.estado)}</span>
              </div>
              <div className="cita-details">
                <div className="cita-column-left">
                  <div className="cita-detail-item">
                    <span className="cita-detail-label">ID Cita</span>
                    <span className="cita-detail-value">{cita.id}</span>
                  </div>
                  <div className="cita-detail-item">
                    <span className="cita-detail-label">Fecha</span>
                    <span className="cita-detail-value">{formatDate(cita.fecha)}</span>
                  </div>
                </div>
                <div className="cita-column-right">
                  <div className="cita-detail-item">
                    <span className="cita-detail-label">Hora</span>
                    <span className="cita-detail-value">{formatTime(cita.hora)}</span>
                  </div>
                  <div className="cita-detail-item">
                    <span className="cita-detail-label">Sede</span>
                    <span className="cita-detail-value">{getSede(cita)}</span>
                  </div>
                </div>
              </div>
              <div className="cita-actions">
                <button className="cita-view-button" onClick={() => openDetailModal(cita)}>
                  Ver Detalle
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L10 8L6 4" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-action">
          <button className="btn-secondary" onClick={() => navigate('/pqrs')}>
            ¿Necesitas ayuda? Radica una PQRS
          </button>
        </div>
      </div>

      {isModalOpen && selectedCita && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">Detalle de la cita #{selectedCita.id}</h2>
              <button type="button" className="modal-close" onClick={closeModal} aria-label="Cerrar">×</button>
            </div>
            <div className="modal-body">
              {isDetailLoading ? (
                <div className="modal-loading">Cargando detalle…</div>
              ) : (
                <>
                  <div className="modal-grid">
                    <div className="modal-field">
                      <span className="label">Estado</span>
                      <span className={estadoToBadge(selectedCita.estado)}>{normalizeEstado(selectedCita.estado)}</span>
                    </div>
                    <div className="modal-field">
                      <span className="label">Fecha</span>
                      <span>{formatDate(selectedCita.fecha)} · {formatTime(selectedCita.hora)}</span>
                    </div>
                    <div className="modal-field">
                      <span className="label">Profesional</span>
                      <span>{getProfesionalNombre(selectedCita)}</span>
                    </div>
                    <div className="modal-field">
                      <span className="label">Especialidad</span>
                      <span>{getEspecialidad(selectedCita) || 'General'}</span>
                    </div>
                    <div className="modal-field">
                      <span className="label">Sede</span>
                      <span>{getSede(selectedCita)}</span>
                    </div>
                    {selectedCita.motivo && (
                      <div className="modal-field full">
                        <span className="label">Motivo</span>
                        <span>{selectedCita.motivo as string}</span>
                      </div>
                    )}
                    <div className="modal-field full">
                      <label className="label" htmlFor="cancelReason">Motivo de cancelación (opcional)</label>
                      <textarea
                        id="cancelReason"
                        className="textarea"
                        placeholder="Ej: No podré asistir"
                        value={cancelReason}
                        onChange={(event) => setCancelReason(event.target.value)}
                      />
                    </div>
                    <div className="modal-field full">
                      <p>¿Tuviste inconvenientes con esta cita?</p>
                      <button type="button" className="btn-secondary" onClick={() => navigate('/pqrs')}>
                        Radica una PQRS
                      </button>
                    </div>
                  </div>
                  {actionError && <div className="alert error compact">{actionError}</div>}
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={handleCheckIn}
                      disabled={!canPerformCheckIn(selectedCita) || actionLoading === 'checkin'}
                    >
                      {actionLoading === 'checkin' ? 'Registrando…' : 'Hacer check-in'}
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={handleCancel}
                      disabled={!canCancel(selectedCita) || actionLoading === 'cancel'}
                    >
                      {actionLoading === 'cancel' ? 'Cancelando…' : 'Cancelar cita'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCitas;


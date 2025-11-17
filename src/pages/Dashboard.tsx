import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PatientPortal.css';
import './Dashboard.css';
import { fetchProfile } from '../services/authService';
import { listarMisCitas, type CitaDetalle } from '../services/citas';
import { isHttpError } from '../services/httpClient';

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

const filterUpcomingCitas = (citas: CitaDetalle[]): CitaDetalle[] => {
  const now = Date.now();
  return citas.filter((cita) => {
    const citaDate = toDateFromCita(cita);
    return !citaDate || citaDate.getTime() >= now - 60 * 60 * 1000;
  });
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
  return match ? `${match[0]}${match[0].length === 5 ? ':00' : ''}` : value;
};

const normalizeEstado = (estado?: string | Record<string, unknown>): string => {
  if (typeof estado === 'string') {
    return estado.replace(/_/g, ' ').toUpperCase();
  }
  if (estado && typeof estado === 'object') {
    const nested = estado.nombre ?? estado.estado ?? estado.descripcion;
    if (typeof nested === 'string') {
      return nested.replace(/_/g, ' ').toUpperCase();
    }
  }
  return 'SIN ESTADO';
};

const estadoToBadge = (estado?: string | Record<string, unknown>): string => {
  const base = typeof estado === 'string'
    ? estado.toLowerCase()
    : typeof estado === 'object' && estado
      ? String(estado.nombre ?? estado.estado ?? '').toLowerCase()
      : '';
  if (base.includes('confirm') || base.includes('program')) {
    return 'status-badge status-confirmed';
  }
  if (base.includes('sala') || base.includes('check')) {
    return 'status-badge status-pending';
  }
  if (base.includes('cancel') || base.includes('no')) {
    return 'status-badge status-unread';
  }
  return 'status-badge';
};

const getProfesionalNombre = (cita?: CitaDetalle | null): string => {
  if (!cita) return 'Por asignar';
  const profesional = cita.profesional;
  if (profesional && typeof profesional === 'object') {
    const record = profesional as Record<string, unknown>;
    const nombre = `${record.nombre ?? ''} ${record.apellido ?? ''}`.trim();
    if (nombre) {
      return nombre;
    }
  }
  if (typeof (cita as Record<string, unknown>).profesionalNombre === 'string') {
    return String((cita as Record<string, unknown>).profesionalNombre);
  }
  return 'Por asignar';
};

const getEspecialidad = (cita?: CitaDetalle | null): string => {
  if (!cita) return '';
  const profesional = cita.profesional;
  if (profesional && typeof profesional === 'object') {
    const record = profesional as Record<string, unknown>;
    if (typeof record.especialidad === 'string') {
      return record.especialidad;
    }
  }
  const raw = (cita as Record<string, unknown>).especialidad;
  return typeof raw === 'string' ? raw : '';
};

const getSede = (cita?: CitaDetalle | null): string => {
  const sede = cita && (cita as Record<string, unknown>).sede;
  if (typeof sede === 'string') {
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState<string>('Paciente');
  const [nextCita, setNextCita] = useState<CitaDetalle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const loadDashboard = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const profile = await fetchProfile(controller.signal);
        const fullName = `${profile.user?.nombre ?? ''} ${profile.user?.apellido ?? ''}`.trim();
        if (fullName) {
          setPatientName(fullName);
        }
        const citas = await listarMisCitas(controller.signal);
        const upcoming = sortCitas(filterUpcomingCitas(citas));
        setNextCita(upcoming[0] ?? null);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        if (isHttpError(error)) {
          if (error.status === 403) {
            setErrorMessage('Tu rol actual no permite consultar /citas/mias. Inicia sesión como paciente.');
          } else {
            setErrorMessage(error.message);
          }
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('No pudimos cargar tu información.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();
    return () => controller.abort();
  }, []);

  return (
    <div className="patient-portal">
      <Navbar />
      <div className="portal-content">
        {/* Encabezado de bienvenida */}
        <div className="welcome-header">
          <h1 className="welcome-title">¡Hola, {patientName || 'Paciente'}!</h1>
          <p className="welcome-subtitle">Gestiona tus citas médicas</p>
        </div>

        {/* Card Próxima Cita */}
        <div className="next-appointment-card">
          <div className="card-header">
            <h2 className="card-title">Próxima Cita</h2>
            {nextCita && (
              <span className={estadoToBadge(nextCita.estado)}>{normalizeEstado(nextCita.estado)}</span>
            )}
          </div>
          {isLoading && <div className="appointment-empty">Consultando tu agenda...</div>}
          {!isLoading && !nextCita && !errorMessage && (
            <div className="appointment-empty">No tienes citas programadas próximamente.</div>
          )}
          {errorMessage && <div className="appointment-empty error">{errorMessage}</div>}
          {nextCita && !isLoading && (
            <>
              <div className="appointment-details">
                <div className="appointment-column-left">
                  <div className="detail-item">
                    <span className="detail-label">ID Cita</span>
                    <span className="detail-value">{nextCita.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fecha</span>
                    <span className="detail-value">{formatDate(nextCita.fecha)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Personal de Salud</span>
                    <span className="detail-value highlight">
                      {getProfesionalNombre(nextCita)}{getEspecialidad(nextCita) ? ` - ${getEspecialidad(nextCita)}` : ''}
                    </span>
                    <span className="detail-subvalue">Sede: {getSede(nextCita)}</span>
                  </div>
                </div>
                <div className="appointment-column-right">
                  <div className="detail-item">
                    <span className="detail-label">Estado</span>
                    <span className="detail-value">{normalizeEstado(nextCita.estado)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hora</span>
                    <span className="detail-value">{formatTime(nextCita.hora)}</span>
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-primary" onClick={() => navigate('/mis-citas')}>
                  Ver Detalle
                </button>
                <button className="btn-secondary" onClick={() => navigate('/mis-citas')}>
                  Check-in
                </button>
              </div>
            </>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="quick-actions-section">
          <h2 className="section-title">Acciones Rápidas</h2>
          <div className="quick-actions-grid">
            <div className="quick-action-card" onClick={() => navigate('/mis-citas')}>
              <svg className="action-icon icon-blue" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10C8 8.89543 8.89543 8 10 8H38C39.1046 8 40 8.89543 40 10V38C40 39.1046 39.1046 40 38 40H10C8.89543 40 8 39.1046 8 38V10Z" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M32 6V12M16 6V12M8 18H40" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="action-text">Mis Citas</span>
            </div>
            <div className="quick-action-card" onClick={() => navigate('/notificaciones')}>
              <svg className="action-icon icon-orange" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 8C18.477 8 14 12.477 14 18V25.1716C14 26.1652 13.6054 27.117 12.9 27.8225L11 29.7225V32H37V29.7225L35.1 27.8225C34.3946 27.117 34 26.1652 34 25.1716V18C34 12.477 29.523 8 24 8Z"
                  stroke="#F97316"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 36C20 38.2091 21.7909 40 24 40C26.2091 40 28 38.2091 28 36"
                  stroke="#F97316"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="action-text">Notificaciones</span>
            </div>
            <div className="quick-action-card" onClick={() => navigate('/pqrs')}>
              <svg className="action-icon icon-purple" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16H36C37.1046 16 38 16.8954 38 18V30C38 31.1046 37.1046 32 36 32H12C10.8954 32 10 31.1046 10 30V18C10 16.8954 10.8954 16 12 16Z" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 22L22 28L32 18" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="action-text">Radicar PQRS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


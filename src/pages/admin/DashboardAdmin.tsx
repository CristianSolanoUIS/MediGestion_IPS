import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminPortal.css';
import './DashboardAdmin.css';
import { request, isHttpError } from '../../services/httpClient';

interface AppointmentLike {
  estado?: string | null;
  estadoCodigo?: string | null;
  estadoCita?: Record<string, unknown> | null;
  [key: string]: unknown;
}

interface PqrsLike {
  estado?: string | null;
  [key: string]: unknown;
}

interface DashboardMetrics {
  totalAppointments: number;
  checkIns: number;
  pending: number;
  activePqrs: number;
}

const INITIAL_METRICS: DashboardMetrics = {
  totalAppointments: 0,
  checkIns: 0,
  pending: 0,
  activePqrs: 0
};

const PENDING_STATUSES = new Set(['pendiente', 'confirmada', 'reprogramada']);

const ACTIVE_PQRS_STATUSES = new Set(['abierto', 'en progreso']);

const CHECK_IN_STATUS = 'ensala';

const extractArray = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const candidates = ['items', 'data', 'results', 'content'];
    for (const key of candidates) {
      const value = (payload as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        return value as T[];
      }
    }
  }

  return [];
};

const normalizeStatus = (value?: string | null): string => value?.trim().toLowerCase() ?? '';

const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const resolveAppointmentStatus = (appointment: AppointmentLike): string => {
  const primary = (appointment.estadoCodigo as string | undefined) ?? (appointment.estado as string | undefined);
  const normalizedPrimary = normalizeStatus(primary);
  if (normalizedPrimary) {
    return normalizedPrimary;
  }

  const estadoCita = appointment.estadoCita;
  if (estadoCita && typeof estadoCita === 'object') {
    const record = estadoCita as Record<string, unknown>;
    const fromNombre = normalizeStatus((record.nombre as string | undefined) ?? (record.estado as string | undefined));
    if (fromNombre) {
      return fromNombre;
    }
  }

  if (appointment.estado && typeof appointment.estado === 'object') {
    const record = appointment.estado as Record<string, unknown>;
    const nested = normalizeStatus(record.nombre as string | undefined);
    if (nested) {
      return nested;
    }
  }

  return '';
};

const DashboardAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadMetrics = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [appointmentsResponse, pqrsResponse] = await Promise.all([
          request<unknown>('/citas', {
            query: { fecha: getTodayDateString() },
            signal: controller.signal
          }),
          request<unknown>('/pqrs', { signal: controller.signal })
        ]);

        const appointments = extractArray<AppointmentLike>(appointmentsResponse);
        const pqrs = extractArray<PqrsLike>(pqrsResponse);

        const totalAppointments = appointments.length;

        const checkIns = appointments.filter((appointment) => resolveAppointmentStatus(appointment) === CHECK_IN_STATUS).length;

        const pending = appointments.filter((appointment) => {
          const status = resolveAppointmentStatus(appointment);
          return status && PENDING_STATUSES.has(status);
        }).length;

        const activePqrs = pqrs.filter((item) => {
          const status = normalizeStatus(item.estado as string | undefined);
          if (!status) {
            return true;
          }
          if (ACTIVE_PQRS_STATUSES.has(status)) {
            return true;
          }
          return false;
        }).length;

        setMetrics({ totalAppointments, checkIns, pending, activePqrs });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        if (isHttpError(error)) {
          setErrorMessage(error.message);
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('No se pudieron cargar los datos del dashboard.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadMetrics();

    return () => {
      controller.abort();
    };
  }, []);

  const metricDisplay = useMemo(
    () => ({
      totalAppointments: metrics.totalAppointments.toLocaleString('es-CO'),
      checkIns: metrics.checkIns.toLocaleString('es-CO'),
      pending: metrics.pending.toLocaleString('es-CO'),
      activePqrs: metrics.activePqrs.toLocaleString('es-CO')
    }),
    [metrics]
  );

  return (
    <div className="admin-portal">
      <NavbarAdmin />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="welcome-header">
          <h1 className="welcome-title">Dashboard Operativo</h1>
          <p className="welcome-subtitle">Gestión administrativa del sistema</p>
        </div>

        {/* Tarjetas de métricas */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value metric-blue">{isLoading ? '…' : metricDisplay.totalAppointments}</div>
            <div className="metric-label">Citas Hoy</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-green">{isLoading ? '…' : metricDisplay.checkIns}</div>
            <div className="metric-label">Check-ins</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-orange">{isLoading ? '…' : metricDisplay.pending}</div>
            <div className="metric-label">Pendientes</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-purple">{isLoading ? '…' : metricDisplay.activePqrs}</div>
            <div className="metric-label">PQRS Activas</div>
          </div>
        </div>

        {errorMessage && (
          <div className="dashboard-error">
            {errorMessage}
          </div>
        )}

        {/* Módulos de Gestión */}
        <div className="modules-section">
          <h2 className="section-title">Módulos de Gestión</h2>
          <div className="modules-grid">
            <div className="module-card">
              <div className="module-icon icon-blue">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 4C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V6C28 4.89543 27.1046 4 26 4H6Z" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 4V8M10 4V8M4 12H28" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="module-title">Gestión de Citas</h3>
              <p className="module-subtitle">Crear, editar y gestionar citas</p>
              <button className="btn-module-blue" onClick={() => navigate('/admin/citas')}>
                Acceder
              </button>
            </div>

            <div className="module-card">
              <div className="module-icon icon-green">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 6C6.89543 6 6 6.89543 6 8V24C6 25.1046 6.89543 26 8 26H24C25.1046 26 26 25.1046 26 24V8C26 6.89543 25.1046 6 24 6H8Z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 12H22M10 16H22M10 20H18" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="module-title">Agenda del Profesional</h3>
              <p className="module-subtitle">Consultar agendas disponibles</p>
              <button className="btn-module-green" onClick={() => navigate('/admin/agenda-profesional')}>
                Acceder
              </button>
            </div>

            <div className="module-card">
              <div className="module-icon icon-purple">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16L14.5 18.5L20 13" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="module-title">Check-in Recepción</h3>
              <p className="module-subtitle">Gestionar llegada de pacientes</p>
              <button className="btn-module-purple" onClick={() => navigate('/admin/checkin')}>
                Acceder
              </button>
            </div>

            <div className="module-card">
              <div className="module-icon icon-orange">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10C8 8.89543 8.89543 8 10 8H22C23.1046 8 24 8.89543 24 10V18C24 19.1046 23.1046 20 22 20H12L8 24V10Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 14H20M12 17H18" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="module-title">Gestión PQRS</h3>
              <p className="module-subtitle">Administrar solicitudes y quejas</p>
              <button className="btn-module-orange" onClick={() => navigate('/admin/pqrs')}>
                Acceder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;



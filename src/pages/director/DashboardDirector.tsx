import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDirector from '../../components/NavbarDirector';
import { request, isHttpError } from '../../services/httpClient';
import '../../styles/DirectorPortal.css';
import './DashboardDirector.css';

type DashboardMetricKey = 'totalPacientes' | 'personalActivo';

interface DashboardMetrics {
  totalPacientes: number | null;
  personalActivo: number | null;
}

type RecordLiteral = Record<string, unknown>;

const INITIAL_METRICS: DashboardMetrics = {
  totalPacientes: null,
  personalActivo: null
};

const formatDateParam = (date: Date): string => {
  const iso = date.toISOString();
  return iso.slice(0, 10);
};

const isRecord = (value: unknown): value is RecordLiteral => Boolean(value && typeof value === 'object');

const pickNumericValue = (source: RecordLiteral, candidates: string[]): number | null => {
  for (const key of candidates) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      continue;
    }

    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return null;
};

const extractTotalFromPayload = (payload: unknown): number | null => {
  if (Array.isArray(payload)) {
    return payload.length;
  }

  if (isRecord(payload)) {
    if (typeof payload.total === 'number' && Number.isFinite(payload.total)) {
      return payload.total;
    }

    const maybeItems = payload.items ?? payload.data ?? payload.results;
    if (Array.isArray(maybeItems)) {
      return maybeItems.length;
    }
  }

  return null;
};

const describeError = (error: unknown): string => {
  if (isHttpError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido al contactar el servicio.';
};

const DashboardDirector: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const latestRequestRef = useRef(0);

  const countEntities = useCallback(async (endpoint: string, signal?: AbortSignal): Promise<number | null> => {
    const payload = await request<unknown>(endpoint, { signal });
    return extractTotalFromPayload(payload);
  }, []);

  const loadMetrics = useCallback(
    async (options?: { signal?: AbortSignal }) => {
      const { signal } = options ?? {};
      const requestId = latestRequestRef.current + 1;
      latestRequestRef.current = requestId;
      setIsLoading(true);
      setErrorMessage(null);

      const result: DashboardMetrics = { ...INITIAL_METRICS };
      const warnings: string[] = [];

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      let kpiSource: RecordLiteral | null = null;

      try {
        const kpiResponse = await request<unknown>('/reportes/kpis', {
          query: {
            desde: formatDateParam(monthStart),
            hasta: formatDateParam(monthEnd)
          },
          signal
        });

        if (isRecord(kpiResponse)) {
          kpiSource = kpiResponse;
        }
      } catch (error) {
        if (!signal?.aborted) {
          warnings.push(`KPIs: ${describeError(error)}`);
        }
      }

      if (kpiSource) {
        result.totalPacientes = pickNumericValue(kpiSource, ['totalPacientes', 'pacientesTotal', 'pacientes']);
        result.personalActivo = pickNumericValue(kpiSource, ['personalSaludActivos', 'personalActivo', 'colaboradoresActivos']);
      }

      if (result.totalPacientes === null && !signal?.aborted) {
        try {
          const count = await countEntities('/pacientes', signal);
          if (count !== null) {
            result.totalPacientes = count;
          } else {
            warnings.push('Pacientes: no se pudo interpretar la respuesta.');
          }
        } catch (error) {
          if (!signal?.aborted) {
            warnings.push(`Pacientes: ${describeError(error)}`);
          }
        }
      }

      if (result.personalActivo === null && !signal?.aborted) {
        try {
          const count = await countEntities('/personal-salud', signal);
          if (count !== null) {
            result.personalActivo = count;
          } else {
            warnings.push('Personal de salud: no se pudo interpretar la respuesta.');
          }
        } catch (error) {
          if (!signal?.aborted) {
            warnings.push(`Personal de salud: ${describeError(error)}`);
          }
        }
      }

      const unresolved: string[] = [];
      if (result.totalPacientes === null) {
        unresolved.push('total de pacientes');
      }
      if (result.personalActivo === null) {
        unresolved.push('personal activo');
      }

      if (!signal?.aborted && latestRequestRef.current === requestId) {
        setMetrics(result);
        setLastUpdated(new Date());

        if (unresolved.length === 2) {
          setErrorMessage('No pudimos cargar las métricas del director. Intenta recargar más tarde.');
        } else if (unresolved.length > 0) {
          setErrorMessage(`Algunas métricas no pudieron recuperarse (${unresolved.join(', ')}).`);
        } else if (warnings.length > 0) {
          setErrorMessage('Cargamos los datos con algunas advertencias. Verifica los servicios si notas cifras inusuales.');
        } else {
          setErrorMessage(null);
        }
      }

      if (!signal?.aborted && latestRequestRef.current === requestId) {
        setIsLoading(false);
      }
    },
    [countEntities]
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadMetrics({ signal: controller.signal });
    return () => controller.abort();
  }, [loadMetrics]);

  const handleRefresh = useCallback(() => {
    void loadMetrics();
  }, [loadMetrics]);

  const hasLoaded = lastUpdated !== null;
  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdated) {
      return null;
    }
    return lastUpdated.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  }, [lastUpdated]);

  const currentMonthLabel = useMemo(() => {
    const now = new Date();
    return new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(now);
  }, []);

  const numberFormatter = useMemo(() => new Intl.NumberFormat('es-CO'), []);

  const metricsConfig: Array<{
    key: DashboardMetricKey;
    label: string;
    colorClass: string;
    formatter: (value: number) => string;
  }> = useMemo(
    () => [
      {
        key: 'totalPacientes',
        label: 'Total Pacientes',
        colorClass: 'metric-blue',
        formatter: (value: number) => numberFormatter.format(Math.round(value))
      },
      {
        key: 'personalActivo',
        label: 'Personal Activo',
        colorClass: 'metric-green',
        formatter: (value: number) => numberFormatter.format(Math.round(value))
      },
      // Se removieron métricas de citasMes y ocupacion por falta de datos confiables
    ],
    [numberFormatter]
  );

  return (
    <div className="director-portal">
      <NavbarDirector />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="welcome-header">
          <div className="welcome-text">
            <h1 className="welcome-title">Dashboard del Director</h1>
            <p className="welcome-subtitle">Resumen ejecutivo y gestión estratégica · {currentMonthLabel}</p>
          </div>
          <div className="dashboard-actions">
            {lastUpdatedLabel && <span className="last-updated">Actualizado {lastUpdatedLabel}</span>}
            <button type="button" className="refresh-button" onClick={handleRefresh} disabled={isLoading}>
              {isLoading && !hasLoaded ? 'Cargando…' : isLoading ? 'Actualizando…' : 'Actualizar'}
            </button>
          </div>
        </div>

        {errorMessage && <div className="dashboard-error">{errorMessage}</div>}

        {/* Tarjetas de métricas */}
        <div className="metrics-grid">
          {metricsConfig.map(({ key, label, colorClass, formatter }) => {
            const rawValue = metrics[key];
            let valueNode: React.ReactNode;

            if (!hasLoaded && isLoading) {
              valueNode = <span className="metric-placeholder" aria-hidden="true" />;
            } else if (rawValue === null) {
              valueNode = <span className="metric-empty">—</span>;
            } else {
              valueNode = <span>{formatter(rawValue)}</span>;
            }

            return (
              <div className="metric-card" key={key}>
                <div className={`metric-value ${colorClass}`}>{valueNode}</div>
                <div className="metric-label">{label}</div>
              </div>
            );
          })}
        </div>

        {/* Módulos de Gestión */}
        <div className="modules-section">
          <h2 className="section-title">Módulos de Gestión</h2>
          <div className="modules-grid">
            <div className="module-card">
              <div className="module-icon icon-blue">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 12C18.2091 12 20 10.2091 20 8C20 5.79086 18.2091 4 16 4C13.7909 4 12 5.79086 12 8C12 10.2091 13.7909 12 16 12Z"
                    stroke="#1A67FD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 24C8 20.6863 11.5817 18 16 18C20.4183 18 24 20.6863 24 24"
                    stroke="#1A67FD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24 12C25.1046 12 26 11.1046 26 10C26 8.89543 25.1046 8 24 8C22.8954 8 22 8.89543 22 10C22 11.1046 22.8954 12 24 12Z"
                    stroke="#1A67FD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M28 24C28 21.7909 26.2091 20 24 20"
                    stroke="#1A67FD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="module-title">Gestión de Usuarios</h3>
              <p className="module-subtitle">Administra usuarios y roles del sistema</p>
              <button className="btn-module-blue" onClick={() => navigate('/director/usuarios')}>
                Acceder
              </button>
            </div>

            <div className="module-card">
              <div className="module-icon icon-green">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 24L10 16L14 22L18 12L22 20L26 8"
                    stroke="#16A34A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 4H28C29.1046 4 30 4.89543 30 6V26C30 27.1046 29.1046 28 28 28H4C2.89543 28 2 27.1046 2 26V6C2 4.89543 2.89543 4 4 4Z"
                    stroke="#16A34A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="module-title">Reportes</h3>
              <p className="module-subtitle">Genera y consulta reportes del sistema</p>
              <button className="btn-module-green" onClick={() => navigate('/director/reportes')}>
                Acceder
              </button>
            </div>
            <div className="module-card">
              <div className="module-icon icon-purple">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 4C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V6C28 4.89543 27.1046 4 26 4H6Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 4V8M10 4V8M4 12H28" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 18H20M12 22H20" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="module-title">Bitácora</h3>
              <p className="module-subtitle">Registro reciente de eventos del sistema</p>
              <button className="btn-module-purple" onClick={() => navigate('/director/bitacora')}>
                Acceder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDirector;



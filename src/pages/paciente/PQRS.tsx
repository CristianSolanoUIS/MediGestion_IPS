import React, { useState, FormEvent, ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import '../../styles/PatientPortal.css';
import './PQRS.css';
import { listarPQRS, crearPQRS, type PqrsItem } from '../../services/pqrs';
import { listarMisCitas, type CitaDetalle } from '../../services/citas';
import { isHttpError } from '../../services/httpClient';
import { getUser } from '../../services/authStorage';

interface PQRSFormData {
  tipo: string;
  citaId: string;
}

type FilterOption = 'todas' | 'abiertas';

const PQRS_TYPES = [
  { value: 'peticion', label: 'Petición' },
  { value: 'queja', label: 'Queja' },
  { value: 'reclamo', label: 'Reclamo' },
  { value: 'sugerencia', label: 'Sugerencia' }
];

const DEFAULT_ESTADO = 'Abierto';

const OPEN_STATUS_KEYWORDS = ['revision', 'revisión', 'pend', 'abiert', 'progreso', 'asign'];

const normalizeEstado = (estado?: string | null): string => {
  if (!estado) {
    return 'SIN ESTADO';
  }
  return estado.replace(/_/g, ' ').trim().toUpperCase();
};

const isEstadoAbierto = (estado?: string | null): boolean => {
  const normalized = normalizeEstado(estado).toLowerCase();
  return OPEN_STATUS_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const formatDateTime = (value?: string | null): string => {
  if (!value) {
    return '—';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
};

const formatDate = (value?: string | null): string => {
  if (!value) {
    return '—';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (value?: string | null): string => {
  if (!value) {
    return '—';
  }
  const match = value.match(/\d{2}:\d{2}/);
  return match ? match[0] : value;
};

const getProfesionalNombre = (cita: CitaDetalle): string => {
  const record = cita.profesional as Record<string, unknown> | undefined;
  if (record) {
    const nombre = `${record.nombre ?? ''} ${record.apellido ?? ''}`.trim();
    if (nombre) {
      return nombre;
    }
  }
  const fallback = (cita as Record<string, unknown>).profesionalNombre;
  return typeof fallback === 'string' && fallback.trim().length > 0 ? fallback : 'Profesional asignado';
};

const sortPqrs = (items: PqrsItem[]): PqrsItem[] => {
  return [...items].sort((a, b) => {
    const dateA = a.fechaRadicado ? Date.parse(a.fechaRadicado) : 0;
    const dateB = b.fechaRadicado ? Date.parse(b.fechaRadicado) : 0;
    return dateB - dateA;
  });
};

const sortCitas = (citas: CitaDetalle[]): CitaDetalle[] => {
  return [...citas].sort((a, b) => {
    const dateA = Date.parse(a.fecha ?? '') || 0;
    const dateB = Date.parse(b.fecha ?? '') || 0;
    return dateA - dateB;
  });
};

const PQRS: React.FC = () => {
  const navigate = useNavigate();
  const patientId = useMemo(() => {
    const storedUser = getUser();
    if (!storedUser?.id) {
      return null;
    }
    const numericId = Number(storedUser.id);
    return Number.isInteger(numericId) ? numericId : null;
  }, []);
  const [formData, setFormData] = useState<PQRSFormData>({ tipo: '', citaId: '' });
  const [pqrsList, setPqrsList] = useState<PqrsItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [listError, setListError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>('todas');
  const [citasOptions, setCitasOptions] = useState<CitaDetalle[]>([]);
  const [citasError, setCitasError] = useState<string | null>(null);

  const loadPQRS = useCallback(async (options: { signal?: AbortSignal; silent?: boolean } = {}): Promise<void> => {
    const { signal, silent } = options;
    if (!silent) {
      setIsLoadingList(true);
    }
    setListError(null);
    try {
      const data = await listarPQRS({}, signal);
      if (signal?.aborted) {
        return;
      }
      setPqrsList(sortPqrs(data));
    } catch (error) {
      if (signal?.aborted) {
        return;
      }
      if (isHttpError(error)) {
        if (error.status === 403) {
          setListError('Tu rol actual no puede consultar /pqrs. Inicia sesión como paciente.');
        } else {
          setListError(error.message);
        }
      } else if (error instanceof Error) {
        setListError(error.message);
      } else {
        setListError('No pudimos cargar tus PQRS.');
      }
    } finally {
      if (!signal?.aborted && !silent) {
        setIsLoadingList(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadPQRS({ signal: controller.signal });
    return () => controller.abort();
  }, [loadPQRS]);

  useEffect(() => {
    const controller = new AbortController();
    const loadCitas = async (): Promise<void> => {
      try {
        const response = await listarMisCitas(controller.signal);
        if (controller.signal.aborted) {
          return;
        }
        setCitasOptions(sortCitas(response));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        if (isHttpError(error)) {
          if (error.status === 403) {
            setCitasError('Tu rol actual no puede consultar /citas/mias para el selector.');
          } else {
            setCitasError(error.message);
          }
        } else if (error instanceof Error) {
          setCitasError(error.message);
        } else {
          setCitasError('No pudimos cargar tus citas para vincular una PQRS.');
        }
      }
    };

    void loadCitas();
    return () => controller.abort();
  }, []);

  const abiertaCount = useMemo(() => pqrsList.filter((item) => isEstadoAbierto(item.estado)).length, [pqrsList]);

  const filteredPQRS = useMemo(() => {
    if (filter === 'abiertas') {
      return pqrsList.filter((item) => isEstadoAbierto(item.estado));
    }
    return pqrsList;
  }, [filter, pqrsList]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!patientId) {
      setSubmitError('No pudimos identificar tu perfil. Vuelve a iniciar sesión e inténtalo de nuevo.');
      return;
    }
    if (!formData.tipo) {
      setSubmitError('Selecciona el tipo de PQRS.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const citaIdNumber = formData.citaId ? Number(formData.citaId) : undefined;
      const payload = {
        tipo: formData.tipo,
        idPaciente: patientId,
        estado: DEFAULT_ESTADO,
        ...(citaIdNumber !== undefined && Number.isInteger(citaIdNumber) ? { idCita: citaIdNumber } : {})
      };
      const created = await crearPQRS(payload);
      setSubmitSuccess(`Registramos tu PQRS ${created.codigo}. Te avisaremos cuando cambie su estado.`);
      setFormData({ tipo: '', citaId: '' });
      await loadPQRS({ silent: true });
    } catch (error) {
      if (isHttpError(error)) {
        if (error.status === 403) {
          setSubmitError('Tu rol actual no puede crear PQRS. Inicia sesión con tu usuario paciente.');
        } else {
          setSubmitError(error.message);
        }
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('No pudimos registrar tu PQRS. Intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    await loadPQRS();
  };

  const resolveStatusClass = (estado?: string | null): string => {
    const normalized = normalizeEstado(estado).toLowerCase();
    if (normalized.includes('cerr') || normalized.includes('resuelt')) {
      return 'status-badge pqrs-status-closed';
    }
    if (isEstadoAbierto(estado)) {
      return 'status-badge pqrs-status-open';
    }
    return 'status-badge pqrs-status-neutral';
  };

  const renderCitaOption = (cita: CitaDetalle): string => {
    const fecha = formatDate(cita.fecha);
    const hora = formatTime(cita.hora);
    return `#${cita.id} - ${fecha}${hora !== '—' ? ` / ${hora}` : ''} - ${getProfesionalNombre(cita)}`;
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
              <h1 className="page-title">Radicar PQRS</h1>
              <p className="page-subtitle">Peticiones, quejas, reclamos y sugerencias en un mismo lugar</p>
            </div>
          </div>
        </div>

        <div className="pqrs-layout">
          <div className="form-card">
            <h2 className="form-card-title">Cuéntanos qué ocurrió</h2>
            {submitError && <div className="alert error">{submitError}</div>}
            {submitSuccess && <div className="alert success">{submitSuccess}</div>}
            <form onSubmit={handleSubmit} className="pqrs-form">
              <div className="form-group">
                <label htmlFor="tipo" className="form-label">Tipo de PQRS</label>
                <select id="tipo" name="tipo" className="form-input" value={formData.tipo} onChange={handleChange} required>
                  <option value="">Selecciona el tipo</option>
                  {PQRS_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="citaId" className="form-label">Relacionada con una cita (opcional)</label>
                <select id="citaId" name="citaId" className="form-input" value={formData.citaId} onChange={handleChange} disabled={citasOptions.length === 0 && !!citasError}>
                  <option value="">No asociar a una cita</option>
                  {citasOptions.map((cita) => (
                    <option key={cita.id} value={cita.id}>{renderCitaOption(cita)}</option>
                  ))}
                </select>
                {citasError && <p className="field-hint">{citasError}</p>}
              </div>

              <div className="info-box">
                <div className="info-box-header">
                  <div className="info-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <strong className="info-title">Lo completamos por ti:</strong>
                </div>
                <ul className="info-list">
                  <li><code>idPaciente</code> y datos de contacto desde tu sesión</li>
                  <li><code>estado</code> inicial "Abierto"</li>
                  <li><code>fechaRadicado</code> y <code>responsable</code> asignados automáticamente</li>
                  <li><code>SLA</code> y <code>fechaCompromiso</code> según la normativa</li>
                </ul>
                <p className="field-hint">Nuestro equipo completará el detalle interno y se comunicará contigo si necesita más información.</p>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando…' : 'Enviar PQRS'}
                </button>
              </div>
            </form>
          </div>

          <div className="pqrs-history-card">
            <div className="pqrs-history-header">
              <div>
                <h2 className="form-card-title">Seguimiento de PQRS</h2>
                <p className="history-subtitle">Revisa el estado y las fechas compromiso de cada caso</p>
              </div>
              <button className="refresh-button" type="button" onClick={() => void handleRefresh()} disabled={isLoadingList}>
                {isLoadingList ? 'Actualizando…' : 'Actualizar'}
              </button>
            </div>

            <div className="filter-toggle">
              <button className={`filter-button ${filter === 'todas' ? 'active' : ''}`} type="button" onClick={() => setFilter('todas')}>
                Todas ({pqrsList.length})
              </button>
              <button className={`filter-button ${filter === 'abiertas' ? 'active' : ''}`} type="button" onClick={() => setFilter('abiertas')}>
                Abiertas ({abiertaCount})
              </button>
            </div>

            {listError && <div className="alert error">{listError}</div>}

            <div className="pqrs-list">
              {isLoadingList && <div className="pqrs-card loading">Cargando tus PQRS…</div>}

              {!isLoadingList && filteredPQRS.length === 0 && (
                <div className="empty-state">
                  {filter === 'abiertas'
                    ? 'No tienes PQRS abiertas. ¡Gracias por mantenernos informados!'
                    : 'Aún no has registrado PQRS desde este portal.'}
                </div>
              )}

              {!isLoadingList &&
                filteredPQRS.map((item) => (
                  <div key={String(item.id)} className="pqrs-card">
                    <div className="pqrs-card-header">
                      <div>
                        <h3>{item.tipo ?? 'PQRS'}</h3>
                        <span className="pqrs-code">{item.codigo}</span>
                      </div>
                      <span className={resolveStatusClass(item.estado)}>{normalizeEstado(item.estado)}</span>
                    </div>
                    {item.descripcion && <p className="pqrs-description">{item.descripcion}</p>}
                    <div className="pqrs-meta-grid">
                      <div className="pqrs-meta-item">
                        <span className="meta-label">Radicado</span>
                        <span className="meta-value">{formatDateTime(item.fechaRadicado)}</span>
                      </div>
                      <div className="pqrs-meta-item">
                        <span className="meta-label">Compromiso</span>
                        <span className="meta-value">{formatDateTime(item.fechaCompromiso)}</span>
                      </div>
                      <div className="pqrs-meta-item">
                        <span className="meta-label">Responsable</span>
                        <span className="meta-value">{item.responsable ?? 'Por asignar'}</span>
                      </div>
                      <div className="pqrs-meta-item">
                        <span className="meta-label">SLA</span>
                        <span className="meta-value">{item.sla ?? '—'}</span>
                      </div>
                      {item.actualizadoEn && (
                        <div className="pqrs-meta-item">
                          <span className="meta-label">Última actualización</span>
                          <span className="meta-value">{formatDateTime(item.actualizadoEn)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PQRS;


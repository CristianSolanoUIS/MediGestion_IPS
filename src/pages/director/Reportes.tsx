import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDirector from '../../components/NavbarDirector';
import '../../styles/DirectorPortal.css';
import './Reportes.css';
import {
  createReport,
  deleteReport,
  downloadReportExport,
  fetchReportKpis,
  fetchReports,
  type ReportKpiPayload,
  type ReportRecord
} from '../../services/directorReports';
import { fetchPacientes, fetchPersonalSalud, type PacienteProfile, type PersonalSaludProfile } from '../../services/directorUsers';
import PatientSelect from '../../components/directory/PatientSelect';
import ProfessionalSelect from '../../components/directory/ProfessionalSelect';
import { isHttpError } from '../../services/httpClient';

interface FiltersState {
  desde: string;
  hasta: string;
  profesionalId: string;
  tipoPQRS: string;
}

interface CreateReportState {
  idPaciente: string;
  idGeneradoPor: string;
  descripcion: string;
}

const EMPTY_FILTERS: FiltersState = {
  desde: '',
  hasta: '',
  profesionalId: '',
  tipoPQRS: ''
};

const EMPTY_CREATE: CreateReportState = {
  idPaciente: '',
  idGeneradoPor: '',
  descripcion: ''
};

const parseDateValue = (value: string): Date | null => {
  if (!value) {
    return null;
  }
  const [yearStr, monthStr, dayStr] = value.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if ([year, month, day].some((part) => Number.isNaN(part))) {
    return null;
  }
  return new Date(year, month - 1, day);
};

const isValidDateRange = (desde: string, hasta: string): boolean => {
  if (!desde || !hasta) {
    return true;
  }
  const from = parseDateValue(desde);
  const to = parseDateValue(hasta);
  if (!from || !to) {
    return true;
  }
  return from.getTime() <= to.getTime();
};

const formatDateLabel = (value: string): string => {
  const date = parseDateValue(value);
  if (!date) {
    return value;
  }
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const Reportes: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [kpis, setKpis] = useState<ReportKpiPayload | null>(null);
  const [isLoadingKpis, setIsLoadingKpis] = useState<boolean>(false);
  const [kpiError, setKpiError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createValues, setCreateValues] = useState<CreateReportState>(EMPTY_CREATE);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSavingReport, setIsSavingReport] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | number | null>(null);
  const [activeExport, setActiveExport] = useState<string | null>(null);
  const [pacientes, setPacientes] = useState<PacienteProfile[]>([]);
  const [profesionales, setProfesionales] = useState<PersonalSaludProfile[]>([]);
  const [isLoadingPeople, setIsLoadingPeople] = useState<boolean>(false);
  const [peopleError, setPeopleError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoadingReports(true);
    setReportsError(null);
    void fetchReports(appliedFilters)
      .then(async (payload) => {
        if (!active) {
          return;
        }
        // Ensure we have latest data for each report
        if (!Array.isArray(payload)) {
          setReports([]);
          setReportsError('La respuesta del servidor no contiene reportes.');
          return;
        }
        setReports(payload);
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        const message = isHttpError(error)
          ? error.message
          : error instanceof Error
            ? error.message
            : 'No se pudieron cargar los reportes.';
        setReportsError(message);
        setReports([]);
      })
      .finally(() => {
        if (active) {
          setIsLoadingReports(false);
        }
      });

    return () => {
      active = false;
    };
  }, [appliedFilters]);

  useEffect(() => {
    let active = true;
    setIsLoadingPeople(true);
    setPeopleError(null);
    void Promise.all([fetchPacientes(), fetchPersonalSalud()])
      .then(([pacientesPayload, profesionalesPayload]) => {
        if (!active) {
          return;
        }
        setPacientes(Array.isArray(pacientesPayload) ? pacientesPayload : []);
        setProfesionales(Array.isArray(profesionalesPayload) ? profesionalesPayload : []);
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        const message = isHttpError(error)
          ? error.message
          : error instanceof Error
            ? error.message
            : 'No se pudieron cargar los usuarios disponibles.';
        setPeopleError(message);
        setPacientes([]);
        setProfesionales([]);
      })
      .finally(() => {
        if (active) {
          setIsLoadingPeople(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoadingKpis(true);
    setKpiError(null);
    void fetchReportKpis(appliedFilters)
      .then((payload) => {
        if (!active) {
          return;
          }
        setKpis(payload);
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        const message = isHttpError(error)
          ? error.message
          : error instanceof Error
            ? error.message
            : 'No se pudieron cargar los KPIs.';
        setKpiError(message);
        setKpis(null);
      })
      .finally(() => {
        if (active) {
          setIsLoadingKpis(false);
        }
      });

    return () => {
      active = false;
    };
  }, [appliedFilters]);

  const handleFilterChange = (field: keyof FiltersState) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFiltersSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!isValidDateRange(filters.desde, filters.hasta)) {
      setReportsError('El rango de fechas es inválido.');
      return;
    }
    setAppliedFilters(filters);
  };

  const handleFiltersReset = (): void => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  };

  const openCreateModal = (): void => {
    setCreateValues(EMPTY_CREATE);
    setCreateError(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = (): void => {
    if (isSavingReport) {
      return;
    }
    setIsCreateModalOpen(false);
  };

  const handleCreateChange = (field: keyof CreateReportState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setCreateValues((prev) => ({ ...prev, [field]: value }));
  };

  const refreshReports = async (): Promise<void> => {
    try {
      const payload = await fetchReports(appliedFilters);
      setReports(payload);
    } catch (error) {
      const message = isHttpError(error)
        ? error.message
        : error instanceof Error
          ? error.message
          : 'No se pudieron refrescar los reportes.';
      setReportsError(message);
    }
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setCreateError(null);

    if (!createValues.idPaciente || !createValues.idGeneradoPor) {
      setCreateError('Selecciona un paciente y un profesional para continuar.');
      return;
    }

    const idPaciente = Number(createValues.idPaciente);
    const idGeneradoPor = Number(createValues.idGeneradoPor);

    if (!Number.isFinite(idPaciente) || !Number.isFinite(idGeneradoPor)) {
      setCreateError('Debes ingresar identificadores numéricos válidos.');
      return;
    }

    setIsSavingReport(true);
    try {
      await createReport({
        idPaciente,
        idGeneradoPor,
        descripcion: createValues.descripcion.trim() || undefined
      });
      setIsCreateModalOpen(false);
      await refreshReports();
    } catch (error) {
      const message = isHttpError(error)
        ? error.message
        : error instanceof Error
          ? error.message
          : 'No se pudo crear el reporte.';
      setCreateError(message);
    } finally {
      setIsSavingReport(false);
    }
  };

  const handleDeleteReport = async (idReporte: number | string): Promise<void> => {
    setDeleteTarget(idReporte);
    try {
      await deleteReport(idReporte);
      await refreshReports();
    } catch (error) {
      const message = isHttpError(error)
        ? error.message
        : error instanceof Error
          ? error.message
          : 'No se pudo eliminar el reporte.';
      setReportsError(message);
    } finally {
      setDeleteTarget(null);
    }
  };

  const triggerDownload = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (resource: 'citas' | 'pqrs', format: 'csv' | 'json'): Promise<void> => {
    setActiveExport(`${resource}-${format}`);
    try {
      const blob = await downloadReportExport(resource, format, {
        desde: appliedFilters.desde || undefined,
        hasta: appliedFilters.hasta || undefined,
        profesionalId: appliedFilters.profesionalId || undefined,
        tipo: resource === 'pqrs' ? appliedFilters.tipoPQRS || undefined : undefined
      });
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${resource}-${timestamp}.${format}`;
      triggerDownload(blob, filename);
    } catch (error) {
      const message = isHttpError(error)
        ? error.message
        : error instanceof Error
          ? error.message
          : 'No se pudo descargar el archivo.';
      setReportsError(message);
    } finally {
      setActiveExport(null);
    }
  };

  const formattedKpis = useMemo(() => {
    if (!kpis) {
      return [];
    }
    const entries: Array<{ label: string; value: number }> = [];
    Object.entries(kpis).forEach(([key, value]) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        entries.push({ label: key, value });
      }
    });
    return entries;
  }, [kpis]);

  const pacientesMap = useMemo(() => {
    const map = new Map<number, { nombre: string; historia?: string }>();
    pacientes.forEach((paciente) => {
      if (typeof paciente.idUsuario === 'number') {
        map.set(paciente.idUsuario, {
          nombre: paciente.usuario?.nombre ?? `Paciente ${paciente.idUsuario}`,
          historia: paciente.idHistoriaClinica
        });
      }
    });
    return map;
  }, [pacientes]);

  const profesionalesMap = useMemo(() => {
    const map = new Map<number, { nombre: string; especialidad?: string | null }>();
    profesionales.forEach((personal) => {
      if (typeof personal.idUsuario === 'number') {
        map.set(personal.idUsuario, {
          nombre: personal.usuario?.nombre ?? `Profesional ${personal.idUsuario}`,
          especialidad: personal.especialidad
        });
      }
    });
    return map;
  }, [profesionales]);

  const filteredReports = useMemo(() => {
    if (reports.length === 0) {
      return reports;
    }

    const fromDate = parseDateValue(appliedFilters.desde);
    const toDate = parseDateValue(appliedFilters.hasta);

    if (fromDate) {
      fromDate.setHours(0, 0, 0, 0);
    }
    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const profesionalFilter = appliedFilters.profesionalId?.trim();

    return reports.filter((reporte) => {
      const generatedAt = new Date(reporte.fechaGeneracion);
      const isValidDate = !Number.isNaN(generatedAt.getTime());

      if (fromDate && isValidDate && generatedAt < fromDate) {
        return false;
      }
      if (toDate && isValidDate && generatedAt > toDate) {
        return false;
      }

      if (profesionalFilter && String(reporte.idGeneradoPor) !== profesionalFilter) {
        return false;
      }

      return true;
    });
  }, [reports, appliedFilters]);

  const hasActiveFilters = Boolean(
    appliedFilters.desde || appliedFilters.hasta || appliedFilters.profesionalId || appliedFilters.tipoPQRS
  );

  return (
    <div className="director-portal">
      <NavbarDirector />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/director/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="page-title">Reportes del Sistema</h1>
              <p className="page-subtitle">Consulta y genera reportes</p>
            </div>
          </div>
        </div>

        {/* Barra superior de acción */}
        <div className="reports-header">
          <span className="reports-label">Reportes disponibles</span>
          <div className="reports-actions">
            <button className="btn-export" onClick={() => handleExport('citas', 'csv')} disabled={activeExport !== null}>
              <span className="btn-export-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 5V15M12 15L8 11M12 15L16 11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 19H19"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="btn-export-text">
                Exportar citas
                <span className="btn-export-subtitle">CSV</span>
              </span>
            </button>
            <button className="btn-export" onClick={() => handleExport('pqrs', 'csv')} disabled={activeExport !== null}>
              <span className="btn-export-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 5V15M12 15L8 11M12 15L16 11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 19H19"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="btn-export-text">
                Exportar PQRS
                <span className="btn-export-subtitle">CSV</span>
              </span>
            </button>
            <button className="btn-generar-reporte" onClick={openCreateModal}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 3H15C15.5523 3 16 3.44772 16 4V14C16 14.5523 15.5523 15 15 15H3C2.44772 15 2 14.5523 2 14V4C2 3.44772 2.44772 3 3 3Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M6 8H12M6 11H10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Nuevo reporte
            </button>
          </div>
        </div>

        <form className="reports-filters" onSubmit={handleFiltersSubmit}>
          <div className="filter-field">
            <label>Desde</label>
            <div>
              <input
                type="date"
                className="input-control input-date"
                value={filters.desde}
                onChange={handleFilterChange('desde')}
              />
              {filters.desde && <div className="date-preview">{formatDateLabel(filters.desde)}</div>}
            </div>
          </div>
          <div className="filter-field">
            <label>Hasta</label>
            <div>
              <input
                type="date"
                className="input-control input-date"
                value={filters.hasta}
                onChange={handleFilterChange('hasta')}
              />
              {filters.hasta && <div className="date-preview">{formatDateLabel(filters.hasta)}</div>}
            </div>
          </div>
          <div className="filter-field">
            <label>Profesional</label>
            <ProfessionalSelect
              value={filters.profesionalId}
              onChange={(value) => setFilters((prev) => ({ ...prev, profesionalId: value }))}
              profesionales={profesionales}
              isLoading={isLoadingPeople}
              placeholder="Todos los profesionales"
              className="select-control"
              showEmailInOptions={false}
            />
          </div>
          <div className="filter-field">
            <label>Tipo PQRS</label>
            <input
              type="text"
              className="input-control"
              value={filters.tipoPQRS}
              onChange={handleFilterChange('tipoPQRS')}
              placeholder="Ej: Felicitación"
            />
          </div>
          <div className="filter-actions">
            <button type="button" className="btn-filter ghost" onClick={handleFiltersReset}>
              Limpiar
            </button>
            <button type="submit" className="btn-filter primary">
              Aplicar filtros
            </button>
          </div>
        </form>

        {formattedKpis.length > 0 && (
          <div className="kpi-grid">
            {formattedKpis.map((entry) => (
              <div key={entry.label} className="kpi-card">
                <span className="kpi-label">{entry.label}</span>
                <span className="kpi-value">{entry.value.toLocaleString('es-CO')}</span>
              </div>
            ))}
          </div>
        )}
        {kpiError && <div className="reports-error">{kpiError}</div>}

        <div className="reportes-list">
          {isLoadingReports ? (
            <div className="reporte-card">
              <div className="reporte-content">
                <p className="reporte-placeholder">Cargando reportes...</p>
              </div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="reporte-card">
              <div className="reporte-content">
                <p className="reporte-placeholder">
                  {reports.length === 0
                    ? 'No hay reportes disponibles por ahora.'
                    : hasActiveFilters
                      ? 'No hay reportes que coincidan con los filtros aplicados.'
                      : 'No hay reportes para mostrar.'}
                </p>
              </div>
            </div>
          ) : (
            filteredReports.map((reporte) => {
              const fecha = new Date(reporte.fechaGeneracion);
              const fechaLabel = Number.isNaN(fecha.getTime())
                ? reporte.fechaGeneracion
                : fecha.toLocaleString('es-CO', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  });
              const description = reporte.descripcion?.trim() ?? `Reporte ${reporte.idReporte}`;
              const pacienteInfo = pacientesMap.get(
                typeof reporte.idPaciente === 'number' ? reporte.idPaciente : Number(reporte.idPaciente)
              );
              const profesionalInfo = profesionalesMap.get(
                typeof reporte.idGeneradoPor === 'number' ? reporte.idGeneradoPor : Number(reporte.idGeneradoPor)
              );
              return (
                <div key={reporte.idReporte} className="reporte-card">
                  <div className="reporte-content">
                    <h3 className="reporte-titulo">{description}</h3>
                    <div className="reporte-info">
                      <div className="reporte-info-column">
                        <div className="reporte-info-item">
                          <span className="reporte-info-label">ID Reporte</span>
                          <span className="reporte-info-value">{reporte.idReporte}</span>
                        </div>
                        <div className="reporte-info-item">
                          <span className="reporte-info-label">Paciente</span>
                          <span className="entity-info">
                            <span className="entity-label">
                              {pacienteInfo?.nombre ?? `Paciente ${reporte.idPaciente}`}
                            </span>
                            <span className="entity-subtitle">
                              ID #{reporte.idPaciente}
                              {pacienteInfo?.historia ? ` · HC ${pacienteInfo.historia}` : ''}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="reporte-info-column">
                        <div className="reporte-info-item">
                          <span className="reporte-info-label">Generado por</span>
                          <span className="entity-info">
                            <span className="entity-label">
                              {profesionalInfo?.nombre ?? `Usuario ${reporte.idGeneradoPor}`}
                            </span>
                            <span className="entity-subtitle">
                              ID #{reporte.idGeneradoPor}
                              {profesionalInfo?.especialidad ? ` · ${profesionalInfo.especialidad}` : ''}
                            </span>
                          </span>
                        </div>
                        <div className="reporte-info-item">
                          <span className="reporte-info-label">Fecha generación</span>
                          <span className="reporte-info-value">{fechaLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="reporte-actions">
                    <button
                      type="button"
                      className="btn-descargar"
                      onClick={() => handleExport('citas', 'json')}
                      disabled={activeExport !== null}
                    >
                      Descargar JSON
                    </button>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleDeleteReport(reporte.idReporte)}
                      disabled={deleteTarget === reporte.idReporte}
                    >
                      {deleteTarget === reporte.idReporte ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {reportsError && <div className="reports-error">{reportsError}</div>}

        <div className="info-card">
          <p className="info-text">
            <strong>Tabla REPORTE:</strong> idReporte, idPaciente, idGeneradoPor, descripcion, fechaGeneracion
          </p>
          <p className="info-text">
            <strong>Tabla DETALLEREPORTE:</strong> idDetalle, idReporte, idCita, observaciones
          </p>
        </div>

      {peopleError && <div className="reports-error">{peopleError}</div>}
      </div>

      {isCreateModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">Nuevo reporte</h2>
              <button type="button" className="modal-close" onClick={closeCreateModal} aria-label="Cerrar">
                ×
              </button>
            </div>
            <form className="modal-form" onSubmit={handleCreateSubmit}>
              <div className="modal-grid">
                <label className="modal-field">
                  <span>ID Paciente</span>
                  <PatientSelect
                    value={createValues.idPaciente}
                    onChange={(value) => setCreateValues((prev) => ({ ...prev, idPaciente: value }))}
                    pacientes={pacientes}
                    isLoading={isLoadingPeople}
                    className="select-control"
                    showExtraInOptions={false}
                    required
                  />
                </label>
                <label className="modal-field">
                  <span>Generado por</span>
                  <ProfessionalSelect
                    value={createValues.idGeneradoPor}
                    onChange={(value) => setCreateValues((prev) => ({ ...prev, idGeneradoPor: value }))}
                    profesionales={profesionales}
                    isLoading={isLoadingPeople}
                    className="select-control"
                    showEmailInOptions={false}
                    required
                  />
                </label>
              </div>
              {peopleError && <div className="modal-warning">{peopleError}</div>}
              {!peopleError && !isLoadingPeople && (pacientes.length === 0 || profesionales.length === 0) && (
                <div className="modal-warning neutral">Necesitas al menos un paciente y un profesional para crear reportes.</div>
              )}
              <label className="modal-field">
                <span>Descripción</span>
                <textarea value={createValues.descripcion} onChange={handleCreateChange('descripcion')} rows={4} />
              </label>
              {createError && <div className="modal-error">{createError}</div>}
              <div className="modal-actions">
                <button type="button" className="modal-button secondary" onClick={closeCreateModal} disabled={isSavingReport}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-button primary"
                  disabled={
                    isSavingReport || isLoadingPeople || pacientes.length === 0 || profesionales.length === 0
                  }
                >
                  {isSavingReport ? 'Guardando...' : 'Crear reporte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;



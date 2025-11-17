import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminPortal.css';
import './GestionPQRS.css';
import { listarPQRS, actualizarPQRS, type PqrsItem } from '../../services/pqrs';
import { getUser } from '../../services/authStorage';
import { isHttpError } from '../../services/httpClient';

const formatDate = (value?: string | null): string => {
  if (!value) {
    return '—';
  }
  const match = value.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : value;
};

const formatSla = (value?: string | null): string => {
  if (!value) {
    return '—';
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : '—';
};

const toDisplay = (value?: string | number | null): string => {
  if (value === undefined || value === null) {
    return '—';
  }
  const text = String(value).trim();
  return text.length ? text : '—';
};

const GestionPQRS: React.FC = () => {
  const navigate = useNavigate();
  const [pqrsList, setPqrsList] = useState<PqrsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<number | string | null>(null);
  const currentUser = getUser();

  const loadPQRS = useCallback(async (options?: { signal?: AbortSignal; silent?: boolean }): Promise<void> => {
    const { signal, silent } = options ?? {};
    if (!silent) {
      setIsLoading(true);
    }
    setErrorMessage(null);
    try {
      const data = await listarPQRS({}, signal);
      if (!signal?.aborted) {
        setPqrsList(data);
      }
    } catch (error) {
      if (signal?.aborted) {
        return;
      }
      if (isHttpError(error)) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('No pudimos cargar las PQRS.');
      }
    } finally {
      if (!silent && !signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadPQRS({ signal: controller.signal });
    return () => controller.abort();
  }, [loadPQRS]);

  const handleAssign = async (pqrs: PqrsItem): Promise<void> => {
    if (!currentUser?.id) {
      setErrorMessage('No fue posible identificar al usuario actual.');
      return;
    }
    setAssigningId(pqrs.id);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await actualizarPQRS(pqrs.id, { responsableId: currentUser.id });
      setSuccessMessage('PQRS asignada correctamente.');
      await loadPQRS({ silent: true });
    } catch (error) {
      if (isHttpError(error)) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('No fue posible asignar la PQRS.');
      }
    } finally {
      setAssigningId(null);
    }
  };

  const resolveBadgeClass = (estado?: string | null): string => {
    const normalized = (estado ?? '').toLowerCase();
    if (normalized.includes('resu')) {
      return 'status-badge status-resolved';
    }
    return 'status-badge status-review';
  };

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
              <h1 className="page-title">Gestión de PQRS</h1>
              <p className="page-subtitle">Administra peticiones, quejas, reclamos y sugerencias</p>
            </div>
          </div>
        </div>

        <div className="table-meta">
          {isLoading && <div className="table-loading">Cargando PQRS…</div>}
          {errorMessage && <div className="table-error">{errorMessage}</div>}
          {successMessage && <div className="table-success">{successMessage}</div>}
        </div>

        {/* Tabla de PQRS */}
        <div className="table-card">
          <table className="pqrs-table">
            <thead>
              <tr>
                <th>ID PQRS</th>
                <th>Paciente</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha Radicado</th>
                <th>SLA</th>
                <th>Responsable</th>
                <th>Fecha Compromiso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && pqrsList.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <div className="table-empty">No hay solicitudes registradas.</div>
                  </td>
                </tr>
              )}
              {pqrsList.map((pqrs) => (
                <tr key={String(pqrs.id)}>
                  <td>{pqrs.codigo}</td>
                  <td>{toDisplay(pqrs.pacienteId)}</td>
                  <td>{toDisplay(pqrs.tipo)}</td>
                  <td>
                    <span className={resolveBadgeClass(pqrs.estado)}>{toDisplay(pqrs.estado)}</span>
                  </td>
                  <td>{formatDate(pqrs.fechaRadicado)}</td>
                  <td>{formatSla(pqrs.sla)}</td>
                  <td>{toDisplay(pqrs.responsable ?? 'No asignado')}</td>
                  <td>{formatDate(pqrs.fechaCompromiso)}</td>
                  <td>
                    <button
                      type="button"
                      className="link-assign"
                      onClick={() => void handleAssign(pqrs)}
                      disabled={assigningId === pqrs.id}
                    >
                      {assigningId === pqrs.id ? 'Asignando…' : 'Asignar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestionPQRS;



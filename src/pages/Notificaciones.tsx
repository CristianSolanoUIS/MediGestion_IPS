import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PatientPortal.css';
import './Notificaciones.css';
import {
  listarMisNotificaciones,
  marcarNotificacionLeida,
  marcarNotificacionNoLeida,
  type NotificacionIcono,
  type NotificacionItem,
  estaLeida
} from '../services/notificaciones';
import { isHttpError } from '../services/httpClient';

const ICONOS: Record<NotificacionIcono, React.ReactElement> = {
  calendar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 4V8M16 4V8M4 10H20M4 6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6Z"
        stroke="#1A67FD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  check: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  info: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
};

const formatDateTime = (value: string | null): string => {
  if (!value) {
    return '—';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
};

const Notificaciones: React.FC = () => {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState<NotificacionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);
  const [filter, setFilter] = useState<'todas' | 'no-leidas'>('todas');

  const unreadCount = useMemo(() => notificaciones.filter((notif) => !estaLeida(notif)).length, [notificaciones]);

  const filteredNotificaciones = useMemo(() => {
    if (filter === 'no-leidas') {
      return notificaciones.filter((notif) => !estaLeida(notif));
    }
    return notificaciones;
  }, [filter, notificaciones]);

  const upsertNotificacion = useCallback((updated: NotificacionItem) => {
    setNotificaciones((prev) => {
      const exists = prev.some((notif) => notif.id === updated.id);
      if (exists) {
        return prev.map((notif) => (notif.id === updated.id ? updated : notif));
      }
      return [updated, ...prev];
    });
  }, []);

  const fetchNotificaciones = useCallback(async (signal?: AbortSignal): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await listarMisNotificaciones(signal);
      if (signal?.aborted) {
        return;
      }
      setNotificaciones(data);
    } catch (error) {
      if (signal?.aborted) {
        return;
      }
      if (isHttpError(error)) {
        if (error.status === 403) {
          setErrorMessage('Tu rol actual no puede consultar /notificaciones. Inicia sesión como paciente.');
        } else {
          setErrorMessage(error.message);
        }
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('No pudimos cargar tus notificaciones.');
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchNotificaciones(controller.signal);
    return () => controller.abort();
  }, [fetchNotificaciones]);

  const handleToggleLectura = async (notif: NotificacionItem): Promise<void> => {
    setUpdatingId(notif.id);
    setActionError(null);
    try {
      const updated = estaLeida(notif)
        ? await marcarNotificacionNoLeida(notif.id)
        : await marcarNotificacionLeida(notif.id);
      upsertNotificacion(updated);
    } catch (error) {
      if (isHttpError(error)) {
        if (error.status === 403) {
          setActionError('Tu rol actual no puede modificar notificaciones.');
        } else {
          setActionError(error.message);
        }
      } else if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError('No pudimos actualizar la notificación.');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    await fetchNotificaciones();
  };

  const getStatusClass = (notif: NotificacionItem): string => (estaLeida(notif) ? 'status-badge status-read' : 'status-badge status-unread');

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
              <h1 className="page-title">Notificaciones</h1>
              <p className="page-subtitle">Revisa tus mensajes y alertas</p>
            </div>
          </div>
        </div>

        <div className="notificaciones-toolbar">
          <div className="filter-toggle">
            <button
              className={`filter-button ${filter === 'todas' ? 'active' : ''}`}
              type="button"
              onClick={() => setFilter('todas')}
            >
              Todas ({notificaciones.length})
            </button>
            <button
              className={`filter-button ${filter === 'no-leidas' ? 'active' : ''}`}
              type="button"
              onClick={() => setFilter('no-leidas')}
            >
              No leídas ({unreadCount})
            </button>
          </div>
          <button className="refresh-button" type="button" onClick={handleRefresh} disabled={isLoading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 12C3 7.58172 6.58172 4 11 4C12.9818 4 14.7877 4.74463 16.1667 5.97917L18 4V9H13"
                stroke="#1A67FD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12C21 16.4183 17.4183 20 13 20C11.0182 20 9.21227 19.2554 7.83333 18.0208L6 20V15H11"
                stroke="#1A67FD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isLoading ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>

        {errorMessage && <div className="alert error">{errorMessage}</div>}
        {actionError && <div className="alert error compact">{actionError}</div>}

        <div className="notificaciones-list">
          {isLoading && <div className="notificacion-card loading">Cargando tus notificaciones…</div>}

          {!isLoading && filteredNotificaciones.length === 0 && (
            <div className="empty-state">
              {filter === 'no-leidas'
                ? 'No tienes notificaciones pendientes. Buen trabajo.'
                : 'Todavía no hemos emitido notificaciones para tu usuario.'}
            </div>
          )}

          {!isLoading &&
            filteredNotificaciones.map((notif) => (
              <div key={String(notif.id)} className="notificacion-card">
                <div className="notificacion-header">
                  <div className="notificacion-icon">{ICONOS[notif.icono] ?? ICONOS.info}</div>
                  <span className={getStatusClass(notif)}>{estaLeida(notif) ? 'Leída' : 'No leída'}</span>
                </div>
                <h3 className="notificacion-titulo">{notif.titulo}</h3>
                <div className="notificacion-id">ID: {notif.id}</div>
                <p className="notificacion-mensaje">{notif.mensaje || 'Sin mensaje disponible.'}</p>
                <div className="notificacion-metadata">
                  <div className="metadata-column">
                    <span className="metadata-label">Tipo</span>
                    <span className="metadata-value">{notif.tipo}</span>
                  </div>
                  <div className="metadata-column">
                    <span className="metadata-label">Creada en</span>
                    <span className="metadata-value">{formatDateTime(notif.fechaCreacion)}</span>
                  </div>
                  {notif.leidaEn && (
                    <div className="metadata-column">
                      <span className="metadata-label">Leída en</span>
                      <span className="metadata-value">{formatDateTime(notif.leidaEn)}</span>
                    </div>
                  )}
                  {notif.prioridad && (
                    <div className="metadata-column">
                      <span className="metadata-label">Prioridad</span>
                      <span className="metadata-value">{notif.prioridad}</span>
                    </div>
                  )}
                </div>
                <div className="notificacion-json">
                  <span className="metadata-label">Metadata</span>
                  <code className="json-value">{notif.metadataTexto ?? 'Sin metadata asociada'}</code>
                </div>
                <div className="notificacion-actions">
                  <button
                    className="notificacion-action-button"
                    type="button"
                    onClick={() => void handleToggleLectura(notif)}
                    disabled={updatingId === notif.id}
                  >
                    {updatingId === notif.id
                      ? 'Guardando…'
                      : estaLeida(notif)
                        ? 'Marcar como no leída'
                        : 'Marcar como leída'}
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="bottom-action">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notificaciones;


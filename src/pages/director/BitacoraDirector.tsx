import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDirector from '../../components/NavbarDirector';
import { fetchBitacora, fetchBitacoraById, type BitacoraEntry } from '../../services/bitacora';
import '../../styles/DirectorPortal.css';
import './BitacoraDirector.css';

interface ParsedDetalle {
  idCita?: string | number;
  motivo?: string;
}

function parseDetalle(raw: unknown): ParsedDetalle {
  if (raw === null || raw === undefined) return {};
  let value: any = raw;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        value = JSON.parse(trimmed);
      } catch {
        return {}; // string not valid JSON
      }
    } else {
      return {}; // plain string we ignore for structured fields
    }
  }
  if (typeof value !== 'object' || Array.isArray(value)) return {};
  const idCita = (value as Record<string, unknown>).idCita;
  // Buscar posible motivo en diferentes claves
  const possibleMotivoKeys = ['motivo', 'motivoCancelacion', 'motivoReprogramacion', 'razon'];
  let motivo: string | undefined;
  for (const k of possibleMotivoKeys) {
    const v = (value as Record<string, unknown>)[k];
    if (typeof v === 'string' && v.trim().length > 0) {
      motivo = v.trim();
      break;
    }
  }
  return {
    idCita: typeof idCita === 'number' || typeof idCita === 'string' ? idCita : undefined,
    motivo
  };
}

const BitacoraDirector: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<BitacoraEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<BitacoraEntry | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    const load = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchBitacora();
        // Assume backend returns sorted desc; if not, sort by fechaHora desc
        const sorted = [...data].sort((a, b) => (a.fechaHora > b.fechaHora ? -1 : 1));
        setEntries(sorted);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cargar bitácora');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const handleOpenDetail = async (idEvento: number): Promise<void> => {
    setSelectedId(idEvento);
    setIsDetailLoading(true);
    setDetailError(null);
    try {
      const detail = await fetchBitacoraById(idEvento);
      setSelectedEntry(detail);
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : 'Error al cargar detalle');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = (): void => {
    setSelectedId(null);
    setSelectedEntry(null);
    setDetailError(null);
  };

  return (
    <div className="director-portal">
      <NavbarDirector />
      <div className="portal-content">
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/director/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="page-title">Bitácora</h1>
              <p className="page-subtitle">Eventos recientes del sistema</p>
            </div>
          </div>
        </div>

        {error && <div className="bitacora-error">{error}</div>}

        <div className="bitacora-table-wrapper">
          <table className="bitacora-table">
            <thead>
              <tr>
                <th>Fecha/Hora</th>
                <th>Sección</th>
                <th>Acción</th>
                <th>Detalle</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="bitacora-loading">Cargando...</td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="bitacora-empty">No hay eventos registrados.</td>
                </tr>
              ) : (
                entries.map((e) => {
                  const dateObj = new Date(e.fechaHora);
                  const label = isNaN(dateObj.getTime())
                    ? e.fechaHora
                    : dateObj.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
                  const parsed = parseDetalle(e.detalle);
                  const detallePreviewParts: string[] = [];
                  if (parsed.idCita !== undefined) detallePreviewParts.push(`Cita: ${parsed.idCita}`);
                  if (parsed.motivo !== undefined) detallePreviewParts.push(`Motivo: ${parsed.motivo}`);
                  const detallePreview = detallePreviewParts.join(' · ');
                  return (
                    <tr
                      key={e.idEvento}
                      className="bitacora-row"
                      onClick={() => handleOpenDetail(e.idEvento)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleOpenDetail(e.idEvento).catch(() => undefined);
                        }
                      }}
                    >
                      <td>{label}</td>
                      <td>{e.seccion ?? '—'}</td>
                      <td>{e.accion ?? '—'}</td>
                      <td>{detallePreview || '—'}</td>
                      <td>{e.idUsuario ? `#${e.idUsuario}` : '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {selectedId !== null && (
          <div className="bitacora-modal-backdrop" role="dialog" aria-modal="true">
            <div className="bitacora-modal">
              <div className="bitacora-modal-header">
                <h2 className="bitacora-modal-title">Detalle del Evento #{selectedId}</h2>
                <button className="bitacora-modal-close" onClick={closeModal} aria-label="Cerrar">×</button>
              </div>
              <div className="bitacora-modal-body">
                {isDetailLoading && <div className="bitacora-modal-loading">Cargando detalle...</div>}
                {detailError && <div className="bitacora-modal-error">{detailError}</div>}
                {selectedEntry && !isDetailLoading && !detailError && (
                  <div className="bitacora-detail-grid">
                    <div className="bitacora-detail-row">
                      <span className="detail-label">Fecha/Hora:</span>
                      <span className="detail-value">
                        {new Date(selectedEntry.fechaHora).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <div className="bitacora-detail-row">
                      <span className="detail-label">Sección:</span>
                      <span className="detail-value">{selectedEntry.seccion ?? '—'}</span>
                    </div>
                    <div className="bitacora-detail-row">
                      <span className="detail-label">Acción:</span>
                      <span className="detail-value">{selectedEntry.accion ?? '—'}</span>
                    </div>
                    <div className="bitacora-detail-row">
                      <span className="detail-label">Usuario:</span>
                      <span className="detail-value">{selectedEntry.idUsuario ? `#${selectedEntry.idUsuario}` : '—'}</span>
                    </div>
                    <div className="bitacora-detail-row detail-row-full">
                      <span className="detail-label">Detalle:</span>
                      <div className="detail-box">
                        {(() => {
                          const parsed = parseDetalle(selectedEntry.detalle);
                          const lines: string[] = [];
                          lines.push(`Cita: ${parsed.idCita !== undefined ? parsed.idCita : ''}`);
                          lines.push(`Motivo: ${parsed.motivo !== undefined ? parsed.motivo : ''}`);
                          return lines.map((l, idx) => (
                            <div key={idx} className="detail-value">{l}</div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bitacora-modal-actions">
                <button className="bitacora-close-btn" onClick={closeModal}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BitacoraDirector;

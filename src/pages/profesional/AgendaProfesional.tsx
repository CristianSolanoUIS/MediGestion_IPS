import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarProfesional from '../../components/NavbarProfesional';
import '../../styles/ProfesionalPortal.css';
import './AgendaProfesional.css';
import { fetchProfile } from '../../services/authService';
import {
  crearAgenda,
  listarAgendas,
  actualizarAgenda,
  eliminarAgenda,
  type AgendaResponse
} from '../../services/agendaService';

interface NewAgendaForm {
  fechaInicio: string;
  fechaFin: string;
  cupos: string; // mantener como string para inputs
  bloques: string;
}

const emptyForm: NewAgendaForm = {
  fechaInicio: '',
  fechaFin: '',
  cupos: '',
  bloques: ''
};

const AgendaProfesional: React.FC = () => {
  const navigate = useNavigate();
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [agendas, setAgendas] = useState<AgendaResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<NewAgendaForm>(emptyForm);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [bloques, setBloques] = useState<Array<{ horaInicio: string; horaFin: string; cupos: string }>>([]);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [blockForm, setBlockForm] = useState<{ horaInicio: string; horaFin: string; cupos: string }>({ horaInicio: '', horaFin: '', cupos: '1' });
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null);
  const [showBlocksList, setShowBlocksList] = useState<boolean>(true);

  const openBlockModal = (index: number | null = null): void => {
    if (index !== null) {
      const blk = bloques[index];
      if (blk) {
        setBlockForm({ horaInicio: blk.horaInicio, horaFin: blk.horaFin, cupos: blk.cupos });
        setEditingBlockIndex(index);
      }
    } else {
      setBlockForm({ horaInicio: '', horaFin: '', cupos: '1' });
      setEditingBlockIndex(null);
    }
    setShowBlockModal(true);
  };

  const closeBlockModal = (): void => {
    setShowBlockModal(false);
    setBlockForm({ horaInicio: '', horaFin: '', cupos: '1' });
    setEditingBlockIndex(null);
  };

  const saveBlock = (e?: React.FormEvent): void => {
    if (e) e.preventDefault();
    if (!blockForm.horaInicio || !blockForm.horaFin) return;
    if (blockForm.horaInicio >= blockForm.horaFin) {
      setFeedback('La hora de inicio debe ser menor que la hora fin');
      return;
    }
    setBloques((prev) => {
      if (editingBlockIndex !== null) {
        return prev.map((b, i) => (i === editingBlockIndex ? { ...blockForm } : b));
      }
      return [...prev, { ...blockForm }];
    });
    closeBlockModal();
  };

  const updateBlock = (index: number, field: string, value: string): void => {
    setBloques((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
  };

  const removeBlock = (index: number): void => {
    setBloques((prev) => prev.filter((_, i) => i !== index));
  };

  const serializeBloques = (): string | undefined => {
    if (bloques.length === 0) return undefined;
    const cleaned = bloques
      .filter((b) => b.horaInicio && b.horaFin)
      .map((b) => ({ horaInicio: b.horaInicio, horaFin: b.horaFin, cupos: parseInt(b.cupos || '1', 10) || 1 }));
    if (cleaned.length === 0) return undefined;
    return JSON.stringify(cleaned);
  };

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const loadProfileAndAgendas = async (): Promise<void> => {
      try {
        setLoading(true);
        const profile = await fetchProfile(controller.signal);
        if (!mounted) return;
        setProfessionalId(profile.user.id);
        setDisplayName(profile.user.nombre ?? 'Profesional');
        const data = await listarAgendas({ profesionalId: profile.user.id }, controller.signal);
        if (!mounted) return;
        setAgendas(data);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'No fue posible cargar agendas');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void loadProfileAndAgendas();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const resetForm = (): void => {
    setForm(emptyForm);
    setBloques([]);
    setEditingBlockIndex(null);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeAgenda = useCallback((a: any): AgendaResponse & { id: number } => {
    const idVal = typeof a.id !== 'undefined' ? a.id : a.idAgenda;
    return { ...a, id: idVal } as AgendaResponse & { id: number };
  }, []);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!professionalId) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const payload = {
        idPersonalSalud: professionalId,
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        cupos: form.cupos ? parseInt(form.cupos, 10) : 0,
        bloques: serializeBloques()
      };
      let result: AgendaResponse & { id: number };
      if (editingId) {
        const raw = await actualizarAgenda(editingId, payload);
        result = normalizeAgenda(raw);
        setAgendas((prev) => prev.map((a) => {
          const currentId = typeof (a as any).id !== 'undefined' ? (a as any).id : (a as any).idAgenda;
          return currentId === editingId ? result : a;
        }));
        setFeedback('Agenda actualizada.');
      } else {
        const raw = await crearAgenda(payload);
        result = normalizeAgenda(raw);
        setAgendas((prev) => [result, ...prev]);
        setFeedback('Agenda creada.');
      }
      resetForm();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'No fue posible guardar la agenda');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (agenda: AgendaResponse): void => {
    const agendaId = typeof (agenda as any).id !== 'undefined' ? (agenda as any).id : (agenda as any).idAgenda;
    setEditingId(agendaId);
    setForm({
      fechaInicio: agenda.fechaInicio,
      fechaFin: agenda.fechaFin,
      cupos: String(agenda.cupos ?? ''),
      bloques: ''
    });
    // intentar parsear bloques si vienen en string
    try {
      const raw = agenda.bloques;
      if (raw) {
        const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (Array.isArray(arr)) {
          setBloques(
            arr.map((item) => ({
              horaInicio: String((item as any).horaInicio || ''),
              horaFin: String((item as any).horaFin || ''),
              cupos: String((item as any).cupos || '1')
            }))
          );
        } else {
          setBloques([]);
        }
      } else {
        setBloques([]);
      }
    } catch {
      setBloques([]);
    }
  };

  const handleDelete = async (rawId: number): Promise<void> => {
    setDeletingId(rawId);
    setFeedback(null);
    try {
      await eliminarAgenda(rawId);
      setAgendas((prev) => prev.filter((a) => {
        const currentId = typeof (a as any).id !== 'undefined' ? (a as any).id : (a as any).idAgenda;
        return currentId !== rawId;
      }));
      setFeedback('Agenda eliminada.');
      if (editingId === rawId) resetForm();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'No fue posible eliminar la agenda');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="profesional-portal">
      <NavbarProfesional />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/pro/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div>
              <h1 className="page-title">Mi Agenda</h1>
              <p className="page-subtitle">Consulta tu disponibilidad</p>
            </div>
          </div>
        </div>

        {/* Lista de agendas */}
        <div className="agenda-form-wrapper">
          <h2 className="section-title">{editingId ? 'Editar agenda' : 'Crear nueva agenda'}</h2>
          {feedback && <div className={`info-banner ${feedback?.toLowerCase().includes('no fue') ? 'error' : 'success'}`}>{feedback}</div>}
          <form className="agenda-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-field">
                <span>Fecha inicio</span>
                <input
                  type="date"
                  name="fechaInicio"
                  value={form.fechaInicio}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="form-field">
                <span>Fecha fin</span>
                <input
                  type="date"
                  name="fechaFin"
                  value={form.fechaFin}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="form-field">
                <span>Cupos</span>
                <input
                  type="number"
                  min={0}
                  name="cupos"
                  value={form.cupos}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="form-field">
                <span>Bloques horarios</span>
                <div className="bloques-builder">
                  <div className="bloques-header">
                    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                      <button
                        type="button"
                        className="btn-add-block"
                        onClick={() => openBlockModal(null)}
                        disabled={submitting}
                      >
                        Nuevo bloque
                      </button>
                      <button
                        type="button"
                        className={`toggle-blocks-btn ${showBlocksList ? 'open' : ''}`}
                        onClick={() => setShowBlocksList(s => !s)}
                        aria-expanded={showBlocksList}
                        aria-label={showBlocksList ? 'Ocultar bloques' : 'Mostrar bloques'}
                      >
                        <span className="toggle-arrow" aria-hidden>▼</span>
                      </button>
                    </div>
                  </div>
                  {showBlocksList && (
                    <div className="bloque-summary-list">
                      {bloques.length === 0 && (
                        <div className="bloques-empty">No hay bloques. Agrega al menos uno.</div>
                      )}
                      {bloques.map((b, i) => (
                        <div key={i} className="bloque-summary-item">
                          <button
                            type="button"
                            className="bloque-summary-main"
                            onClick={() => openBlockModal(i)}
                            aria-label={`Editar bloque ${i+1}`}
                          >
                            <span className="bloque-summary-title">Bloque #{i + 1}</span>
                            <span className="bloque-summary-hours">{b.horaInicio || '??'} - {b.horaFin || '??'}</span>
                            <span className="bloque-summary-cupos">{b.cupos} cupos</span>
                          </button>
                          <button
                            type="button"
                            className="bloque-summary-delete"
                            onClick={() => removeBlock(i)}
                            aria-label={`Eliminar bloque ${i+1}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </label>
            </div>
            <div className="form-actions">
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm} disabled={submitting}>
                  Cancelar edición
                </button>
              )}
              <button type="submit" className="btn-primary-green" disabled={submitting || !professionalId}>
                {submitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear agenda'}
              </button>
            </div>
          </form>
        </div>

        <h2 className="section-title">Mis agendas</h2>
        {loading && <div className="info-banner muted">Cargando agendas...</div>}
        {error && <div className="info-banner error">{error}</div>}
        {!loading && agendas.length === 0 && !error && (
          <div className="info-banner muted">No tienes agendas registradas.</div>
        )}
        <div className="agendas-list">
          {agendas.map((agenda) => {
            const agendaId = typeof (agenda as any).id !== 'undefined' ? (agenda as any).id : (agenda as any).idAgenda;
            return (
            <div key={agendaId} className="agenda-card">
              <div className="agenda-card-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 2C2.89543 2 2 2.89543 2 4V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V4C18 2.89543 17.1046 2 16 2H4Z" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V6M6 2V6M2 10H18" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="agenda-content">
                <div className="agenda-column-left">
                  <h3 className="agenda-title">Agenda #{agendaId}</h3>
                  <div className="agenda-details">
                    <div className="agenda-detail-item">
                      <span className="agenda-detail-label">Fecha inicio</span>
                      <span className="agenda-detail-value">{agenda.fechaInicio}</span>
                    </div>
                    <div className="agenda-detail-item">
                      <span className="agenda-detail-label">Fecha fin</span>
                      <span className="agenda-detail-value">{agenda.fechaFin}</span>
                    </div>
                    <div className="agenda-detail-item">
                      <span className="agenda-detail-label">Cupos</span>
                      <span className="agenda-detail-value highlight">{agenda.cupos}</span>
                    </div>
                  </div>
                </div>
                <div className="agenda-column-right">
                  <div className="agenda-detail-item">
                    <span className="agenda-detail-label">Bloques</span>
                    <span className="agenda-detail-value">
                      {(() => {
                        const raw = agenda.bloques;
                        if (!raw) return '—';
                        try {
                          const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
                          if (Array.isArray(arr)) {
                            return arr
                              .map(
                                (blk: any) => `${blk.horaInicio || '?'}-${blk.horaFin || '?'}(${blk.cupos || 1})`
                              )
                              .join(', ');
                          }
                          return '—';
                        } catch {
                          return String(raw).slice(0, 40);
                        }
                      })()}
                    </span>
                  </div>
                  <div className="agenda-actions">
                    <button
                      type="button"
                      className="agenda-action-btn edit"
                      onClick={() => handleEdit(agenda)}
                      disabled={submitting || deletingId === agendaId}
                    >
                      ✎ Editar
                    </button>
                    <button
                      type="button"
                      className="agenda-action-btn delete"
                      onClick={() => void handleDelete(agendaId)}
                      disabled={submitting || deletingId === agendaId}
                    >
                      {deletingId === agendaId ? '…' : '🗑 Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );})}
        </div>
        {showBlockModal && (
          <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{editingBlockIndex !== null ? `Editar bloque #${editingBlockIndex + 1}` : 'Nuevo bloque'}</h3>
                <button type="button" className="modal-close" onClick={closeBlockModal} aria-label="Cerrar">×</button>
              </div>
              <form onSubmit={saveBlock} className="modal-body">
                <div className="modal-row">
                  <label className="modal-field">
                    <span>Hora inicio</span>
                    <input type="time" value={blockForm.horaInicio} onChange={(e) => setBlockForm((p) => ({ ...p, horaInicio: e.target.value }))} required />
                  </label>
                  <label className="modal-field">
                    <span>Hora fin</span>
                    <input type="time" value={blockForm.horaFin} onChange={(e) => setBlockForm((p) => ({ ...p, horaFin: e.target.value }))} required />
                  </label>
                  <label className="modal-field">
                    <span>Cupos</span>
                    <input type="number" min={1} value={blockForm.cupos} onChange={(e) => setBlockForm((p) => ({ ...p, cupos: e.target.value }))} required />
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeBlockModal} disabled={submitting}>Cancelar</button>
                  <button type="submit" className="btn-primary-green" disabled={submitting}>{editingBlockIndex !== null ? 'Guardar bloque' : 'Agregar bloque'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaProfesional;


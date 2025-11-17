import React, { useCallback, useEffect, useMemo, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminPortal.css';
import './GestionCitas.css';
import './AgendaProfesional.css';
import { isHttpError } from '../../services/httpClient';
import {
  listarAgendas,
  crearAgenda,
  actualizarAgenda,
  eliminarAgenda,
  type AgendaResponse,
  type AgendaBlock
} from '../../services/agendaService';
import { getSelectedRole, getUser } from '../../services/authStorage';

interface FiltersState {
  desde: string;
  hasta: string;
  profesionalId: string;
}

interface AgendaBlockForm {
  horaInicio: string;
  horaFin: string;
  cupos: string;
}

interface AgendaFormState {
  idPersonalSalud: string;
  fechaInicio: string;
  fechaFin: string;
  cupos: string;
  cuposDisponibles: string;
  blocks: AgendaBlockForm[];
}

const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeDateInput = (value: string): string => {
  if (!value) {
    return '';
  }
  const match = value.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : value;
};

const parseNumericId = (rawValue: string): number | null => {
  if (!rawValue) {
    return null;
  }
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }
  if (/^-?\d+$/.test(trimmed)) {
    const parsed = Number(trimmed);
    return Number.isInteger(parsed) ? parsed : null;
  }
  const digits = trimmed.match(/\d+/g);
  if (!digits) {
    return null;
  }
  const joined = digits.join('');
  const parsed = Number(joined);
  return Number.isInteger(parsed) ? parsed : null;
};

const blocksToPayload = (blocks: AgendaBlockForm[]): AgendaBlock[] =>
  blocks
    .filter((block) => block.horaInicio && block.horaFin)
    .map((block) => {
      const cuposValue = block.cupos ? Number(block.cupos) : undefined;
      return {
        horaInicio: block.horaInicio,
        horaFin: block.horaFin,
        cupos: cuposValue !== undefined && !Number.isNaN(cuposValue) ? cuposValue : undefined
      };
    });

const parseBlocksFromSource = (source: AgendaResponse['bloques']): AgendaBlockForm[] => {
  if (!source) {
    return [];
  }
  let rawBlocks: AgendaBlock[] = [];
  if (Array.isArray(source)) {
    rawBlocks = source as AgendaBlock[];
  } else if (typeof source === 'string') {
    try {
      const parsed = JSON.parse(source);
      if (Array.isArray(parsed)) {
        rawBlocks = parsed as AgendaBlock[];
      }
    } catch (error) {
      console.warn('No fue posible parsear los bloques de agenda', error);
      return [];
    }
  }
  return rawBlocks.map((block) => ({
    horaInicio: block.horaInicio ?? '',
    horaFin: block.horaFin ?? '',
    cupos: block.cupos !== undefined && block.cupos !== null ? String(block.cupos) : ''
  }));
};

const formatBlocksForDisplay = (source: AgendaResponse['bloques']): string[] => {
  if (!source) {
    return [];
  }
  if (Array.isArray(source)) {
    return source.map((block) => {
      const start = block.horaInicio ?? '--';
      const end = block.horaFin ?? '--';
      const cupos = block.cupos ? ` (${block.cupos} cupos)` : '';
      return `${start} - ${end}${cupos}`;
    });
  }
  if (typeof source === 'string') {
    return source.split(',').map((block) => block.trim()).filter(Boolean);
  }
  return [];
};

const resolveAgendaOwnerId = (agenda: AgendaResponse): number | null => {
  if (agenda.idPersonalSalud !== null && agenda.idPersonalSalud !== undefined) {
    return agenda.idPersonalSalud;
  }
  const nestedId = (agenda.personalSalud?.id ?? (agenda as Record<string, unknown>).idPersonal) as number | string | undefined;
  if (typeof nestedId === 'number') {
    return nestedId;
  }
  if (typeof nestedId === 'string') {
    return parseNumericId(nestedId);
  }
  return null;
};

const buildProfessionalName = (agenda: AgendaResponse): string => {
  const nested = agenda.personalSalud;
  if (nested) {
    const name = `${nested.nombre ?? ''} ${nested.apellido ?? ''}`.trim();
    if (name) {
      return name;
    }
  }
  const raw = (agenda as Record<string, unknown>).profesional ?? (agenda as Record<string, unknown>).nombreProfesional;
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim();
  }
  return 'Profesional sin nombre';
};

const AgendaProfesionalAdmin: React.FC = () => {
  const navigate = useNavigate();
  const identity = useMemo(() => {
    return {
      selectedRole: getSelectedRole(),
      userId: getUser()?.id ?? null
    };
  }, []);

  const isAdmin = identity.selectedRole === 'administrador';
  const isProfessional = identity.selectedRole === 'profesional';
  const defaultProfessionalId = !isAdmin && identity.userId ? String(identity.userId) : '';

  const computeInitialFilters = useCallback((): FiltersState => ({
    desde: getTodayDateString(),
    hasta: '',
    profesionalId: defaultProfessionalId
  }), [defaultProfessionalId]);

  const buildEmptyForm = useCallback((): AgendaFormState => ({
    idPersonalSalud: defaultProfessionalId,
    fechaInicio: '',
    fechaFin: '',
    cupos: '',
    cuposDisponibles: '',
    blocks: []
  }), [defaultProfessionalId]);

  const [filters, setFilters] = useState<FiltersState>(() => computeInitialFilters());
  const [pendingFilters, setPendingFilters] = useState<FiltersState>(() => computeInitialFilters());
  const [agendas, setAgendas] = useState<AgendaResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<AgendaFormState>(() => buildEmptyForm());
  const [createSubmitting, setCreateSubmitting] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<AgendaFormState>(() => buildEmptyForm());
  const [editTarget, setEditTarget] = useState<AgendaResponse | null>(null);
  const [editSubmitting, setEditSubmitting] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AgendaResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const ensureOwnerFilter = useCallback(
    (state: FiltersState): FiltersState => {
      if (isAdmin) {
        return { ...state };
      }
      return {
        ...state,
        profesionalId: identity.userId ? String(identity.userId) : state.profesionalId
      };
    },
    [identity.userId, isAdmin]
  );

  const refreshAgendas = useCallback(
    async (options?: { signal?: AbortSignal; skipLoader?: boolean }): Promise<boolean> => {
      const { signal, skipLoader } = options ?? {};
      if (!skipLoader) {
        setIsLoading(true);
      }
      setErrorMessage(null);
      try {
        const effectiveFilters = ensureOwnerFilter(filters);
        const params: { desde?: string; hasta?: string; profesionalId?: number } = {};
        if (effectiveFilters.desde) {
          params.desde = effectiveFilters.desde;
        }
        if (effectiveFilters.hasta) {
          params.hasta = effectiveFilters.hasta;
        }
        if (effectiveFilters.profesionalId) {
          const ownerId = parseNumericId(effectiveFilters.profesionalId);
          if (ownerId !== null) {
            params.profesionalId = ownerId;
          }
        }
        const data = await listarAgendas(params, signal);
        if (!signal?.aborted) {
          setAgendas(data);
        }
        return true;
      } catch (error) {
        if (signal?.aborted) {
          return false;
        }
        if (isHttpError(error)) {
          if (error.status === 403) {
            setErrorMessage('No tienes permisos para consultar estas agendas.');
          } else if (error.status === 404) {
            setErrorMessage('No encontramos agendas con los filtros aplicados.');
          } else {
            setErrorMessage(error.message);
          }
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('No pudimos cargar las agendas.');
        }
        return false;
      } finally {
        if (!skipLoader && !signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [ensureOwnerFilter, filters]
  );

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setPendingFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSuccessMessage(null);
    const ensured = ensureOwnerFilter(pendingFilters);
    setFilters(ensured);
  };

  const handleResetFilters = (): void => {
    const defaults = computeInitialFilters();
    setPendingFilters(defaults);
    setFilters(defaults);
  };

  const handleOpenCreate = (): void => {
    setCreateError(null);
    setCreateForm(buildEmptyForm());
    setCreateModalOpen(true);
  };

  const handleCloseCreate = (): void => {
    if (createSubmitting) {
      return;
    }
    setCreateModalOpen(false);
    setCreateError(null);
  };

  const handleCloseEdit = (): void => {
    if (editSubmitting) {
      return;
    }
    setEditModalOpen(false);
    setEditTarget(null);
    setEditError(null);
  };

  const handleCreateInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const mutateBlocks = (
    updater: (blocks: AgendaBlockForm[]) => AgendaBlockForm[],
    context: 'create' | 'edit'
  ): void => {
    if (context === 'create') {
      setCreateForm((prev) => ({ ...prev, blocks: updater(prev.blocks) }));
    } else {
      setEditForm((prev) => ({ ...prev, blocks: updater(prev.blocks) }));
    }
  };

  const addBlock = (context: 'create' | 'edit'): void => {
    mutateBlocks((blocks) => [...blocks, { horaInicio: '', horaFin: '', cupos: '1' }], context);
  };

  const updateBlockValue = (context: 'create' | 'edit', index: number, field: keyof AgendaBlockForm, value: string): void => {
    mutateBlocks(
      (blocks) =>
        blocks.map((block, blockIndex) =>
          blockIndex === index
            ? {
                ...block,
                [field]: value
              }
            : block
        ),
      context
    );
  };

  const removeBlock = (context: 'create' | 'edit', index: number): void => {
    mutateBlocks((blocks) => blocks.filter((_, blockIndex) => blockIndex !== index), context);
  };

  const buildPayloadFromForm = (formState: AgendaFormState, forcedOwnerId?: number | null) => {
    const ownerId = forcedOwnerId ?? parseNumericId(formState.idPersonalSalud);
    if (ownerId === null) {
      return { error: 'Ingresa un ID de profesional válido.' } as const;
    }
    if (!formState.fechaInicio || !formState.fechaFin) {
      return { error: 'Selecciona el rango de fechas de la agenda.' } as const;
    }
    if (formState.fechaFin < formState.fechaInicio) {
      return { error: 'La fecha fin debe ser posterior o igual a la fecha inicio.' } as const;
    }
    if (!formState.cupos) {
      return { error: 'Define la cantidad de cupos.' } as const;
    }
    const payload = {
      idPersonalSalud: ownerId,
      fechaInicio: normalizeDateInput(formState.fechaInicio),
      fechaFin: normalizeDateInput(formState.fechaFin),
      cupos: Number(formState.cupos),
      cuposDisponibles: formState.cuposDisponibles ? Number(formState.cuposDisponibles) : undefined,
      bloques: blocksToPayload(formState.blocks)
    };
    if (Number.isNaN(payload.cupos) || payload.cupos < 0) {
      return { error: 'Los cupos deben ser un número positivo.' } as const;
    }
    if (payload.cuposDisponibles !== undefined && (Number.isNaN(payload.cuposDisponibles) || payload.cuposDisponibles < 0)) {
      return { error: 'Los cupos disponibles deben ser un número positivo.' } as const;
    }
    return { payload } as const;
  };

  const canManageAgenda = useCallback(
    (agenda: AgendaResponse): boolean => {
      if (isAdmin) {
        return true;
      }
      if (isProfessional && identity.userId !== null) {
        const ownerId = resolveAgendaOwnerId(agenda);
        return ownerId !== null && ownerId === identity.userId;
      }
      return false;
    },
    [identity.userId, isAdmin, isProfessional]
  );

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setCreateError(null);
    const { payload, error } = buildPayloadFromForm(createForm, isAdmin ? null : identity.userId);
    if (!payload) {
      setCreateError(error ?? 'Formulario incompleto.');
      return;
    }
    setCreateSubmitting(true);
    try {
      await crearAgenda(payload);
      setSuccessMessage('Agenda creada correctamente.');
      setCreateModalOpen(false);
      setCreateForm(buildEmptyForm());
      await refreshAgendas({ skipLoader: true });
    } catch (err) {
      if (isHttpError(err)) {
        if (err.status === 403) {
          setCreateError('No tienes permisos para crear agendas para este profesional.');
        } else {
          setCreateError(err.message);
        }
      } else if (err instanceof Error) {
        setCreateError(err.message);
      } else {
        setCreateError('No pudimos crear la agenda.');
      }
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleEditClick = (agenda: AgendaResponse): void => {
    if (!canManageAgenda(agenda)) {
      setErrorMessage('Solo puedes editar agendas propias.');
      return;
    }
    setEditTarget(agenda);
    setEditForm({
      idPersonalSalud: resolveAgendaOwnerId(agenda)?.toString() ?? '',
      fechaInicio: normalizeDateInput(agenda.fechaInicio ?? ''),
      fechaFin: normalizeDateInput(agenda.fechaFin ?? ''),
      cupos: agenda.cupos !== undefined && agenda.cupos !== null ? String(agenda.cupos) : '',
      cuposDisponibles: agenda.cuposDisponibles !== undefined && agenda.cuposDisponibles !== null ? String(agenda.cuposDisponibles) : '',
      blocks: parseBlocksFromSource(agenda.bloques)
    });
    setEditError(null);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!editTarget) {
      return;
    }
    setEditError(null);
    const { payload, error } = buildPayloadFromForm(editForm, isAdmin ? null : identity.userId);
    if (!payload) {
      setEditError(error ?? 'Formulario incompleto.');
      return;
    }
    setEditSubmitting(true);
    try {
      await actualizarAgenda(editTarget.id, payload);
      setSuccessMessage('Agenda actualizada.');
      setEditModalOpen(false);
      setEditTarget(null);
      await refreshAgendas({ skipLoader: true });
    } catch (err) {
      if (isHttpError(err)) {
        if (err.status === 403) {
          setEditError('No puedes editar esta agenda.');
        } else if (err.status === 404) {
          setEditError('La agenda ya no existe.');
        } else {
          setEditError(err.message);
        }
      } else if (err instanceof Error) {
        setEditError(err.message);
      } else {
        setEditError('No pudimos actualizar la agenda.');
      }
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteClick = (agenda: AgendaResponse): void => {
    if (!canManageAgenda(agenda)) {
      setErrorMessage('Solo puedes eliminar agendas propias.');
      return;
    }
    setDeleteError(null);
    setDeleteTarget(agenda);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteTarget) {
      return;
    }
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await eliminarAgenda(deleteTarget.id);
      setSuccessMessage('Agenda eliminada.');
      setDeleteTarget(null);
      await refreshAgendas({ skipLoader: true });
    } catch (err) {
      if (isHttpError(err)) {
        if (err.status === 403) {
          setDeleteError('No puedes eliminar esta agenda.');
        } else if (err.status === 404) {
          setDeleteError('La agenda ya no está disponible.');
        } else {
          setDeleteError(err.message);
        }
      } else if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError('No pudimos eliminar la agenda.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = (): void => {
    if (deleteLoading) {
      return;
    }
    setDeleteTarget(null);
  };

  return (
    <div className="admin-portal">
      <NavbarAdmin />
      <div className="portal-content">
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="page-title">Agenda del Profesional</h1>
              <p className="page-subtitle">Administra la disponibilidad publicada por el equipo médico.</p>
            </div>
          </div>
          <button className="btn-create" type="button" onClick={handleOpenCreate}>
            + Nueva agenda
          </button>
        </div>

        <form className="filter-card" onSubmit={handleFilterSubmit}>
          <div className="filter-card-grid">
            <label className="filter-field">
              <span>Desde</span>
              <input type="date" name="desde" value={pendingFilters.desde} onChange={handleFilterChange} />
            </label>
            <label className="filter-field">
              <span>Hasta</span>
              <input type="date" name="hasta" value={pendingFilters.hasta} onChange={handleFilterChange} min={pendingFilters.desde} />
            </label>
            <label className="filter-field">
              <span>ID Profesional</span>
              <input
                type="text"
                name="profesionalId"
                value={pendingFilters.profesionalId}
                onChange={handleFilterChange}
                disabled={!isAdmin}
                placeholder={isAdmin ? 'Ej: 102233' : 'Solo lectura'}
              />
            </label>
          </div>
          <div className="filter-card-actions">
            <button type="submit" className="btn-create">
              Aplicar filtros
            </button>
            <button type="button" className="btn-ghost" onClick={handleResetFilters}>
              Limpiar
            </button>
          </div>
        </form>

        <div className="table-card agenda-table-card">
          <div className="table-headline">
            <div>
              <h2>Agendas publicadas</h2>
              <p>Consulta, edita y gestiona la disponibilidad de los profesionales.</p>
            </div>
            <span className="table-counter">{agendas.length} registros</span>
          </div>
          {isLoading && <div className="table-placeholder">Cargando agendas...</div>}
          {!isLoading && agendas.length === 0 && <div className="table-placeholder">No hay agendas registradas para los filtros seleccionados.</div>}
          {!isLoading && agendas.length > 0 && (
            <table className="citas-table agenda-table">
              <thead>
                <tr>
                  <th>Agenda</th>
                  <th>Profesional</th>
                  <th>Vigencia</th>
                  <th>Cupos</th>
                  <th>Bloques</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {agendas.map((agenda) => {
                  const ownerId = resolveAgendaOwnerId(agenda);
                  const blocks = formatBlocksForDisplay(agenda.bloques);
                  const canEdit = canManageAgenda(agenda);
                  return (
                    <tr key={agenda.id}>
                      <td>
                        <div className="cell-two-lines">
                          <span className="cell-line-1">Agenda #{agenda.id}</span>
                          <span className="cell-line-2">ID profesional: {ownerId ?? '—'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="cell-two-lines">
                          <span className="cell-line-1">{buildProfessionalName(agenda)}</span>
                          <span className="cell-line-2">{agenda.personalSalud?.documento ?? 'Sin documento'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="cell-two-lines">
                          <span className="cell-line-1">{normalizeDateInput(agenda.fechaInicio)}</span>
                          <span className="cell-line-2">{normalizeDateInput(agenda.fechaFin)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="cell-two-lines">
                          <span className="cell-line-1">{agenda.cupos ?? '—'} cupos</span>
                          <span className="cell-line-2">Disponibles: {agenda.cuposDisponibles ?? '—'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="block-chips">
                          {blocks.length === 0 && <span className="chip-muted">Sin bloques</span>}
                          {blocks.map((block, index) => (
                            <span key={`${agenda.id}-block-${index}`} className="chip-pill">
                              {block}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="action-links">
                          <button type="button" className="link-edit" onClick={() => handleEditClick(agenda)} disabled={!canEdit} title={canEdit ? 'Editar agenda' : 'Solo editable por su dueño o administrador'}>
                            Editar
                          </button>
                          <button type="button" className="link-cancel" onClick={() => handleDeleteClick(agenda)} disabled={!canEdit} title={canEdit ? 'Eliminar agenda' : 'Solo eliminable por su dueño o administrador'}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {errorMessage && <div className="table-error">{errorMessage}</div>}
          {successMessage && <div className="table-success">{successMessage}</div>}
        </div>
      </div>

      {createModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">Nueva agenda</h2>
              <button className="modal-close" type="button" onClick={handleCloseCreate} disabled={createSubmitting}>
                ×
              </button>
            </div>
            {createError && <div className="modal-error">{createError}</div>}
            <form className="modal-form" onSubmit={handleCreateSubmit}>
              <div className="modal-grid">
                <label className="modal-field">
                  <span>ID profesional</span>
                  <input
                    type="text"
                    name="idPersonalSalud"
                    value={createForm.idPersonalSalud}
                    onChange={handleCreateInputChange}
                    disabled={!isAdmin}
                    placeholder="Ej: 105566"
                  />
                </label>
                <label className="modal-field">
                  <span>Cupos totales</span>
                  <input type="number" min={0} name="cupos" value={createForm.cupos} onChange={handleCreateInputChange} />
                </label>
                <label className="modal-field">
                  <span>Fecha inicio</span>
                  <input type="date" name="fechaInicio" value={createForm.fechaInicio} onChange={handleCreateInputChange} />
                </label>
                <label className="modal-field">
                  <span>Fecha fin</span>
                  <input type="date" name="fechaFin" value={createForm.fechaFin} onChange={handleCreateInputChange} min={createForm.fechaInicio || undefined} />
                </label>
                <label className="modal-field">
                  <span>Cupos disponibles (opcional)</span>
                  <input type="number" min={0} name="cuposDisponibles" value={createForm.cuposDisponibles} onChange={handleCreateInputChange} />
                </label>
              </div>
              <div className="blocks-editor">
                <div className="blocks-editor-header">
                  <span>Bloques horarios</span>
                  <button type="button" className="btn-ghost" onClick={() => addBlock('create')}>
                    + Agregar bloque
                  </button>
                </div>
                {createForm.blocks.length === 0 && <div className="blocks-empty">No hay bloques definidos.</div>}
                {createForm.blocks.map((block, index) => (
                  <div key={`create-block-${index}`} className="blocks-row">
                    <input type="time" value={block.horaInicio} onChange={(event) => updateBlockValue('create', index, 'horaInicio', event.target.value)} />
                    <input type="time" value={block.horaFin} onChange={(event) => updateBlockValue('create', index, 'horaFin', event.target.value)} />
                    <input type="number" min={0} value={block.cupos} onChange={(event) => updateBlockValue('create', index, 'cupos', event.target.value)} placeholder="Cupos" />
                    <button type="button" className="btn-remove" onClick={() => removeBlock('create', index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={handleCloseCreate} disabled={createSubmitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-create" disabled={createSubmitting}>
                  {createSubmitting ? 'Guardando...' : 'Crear agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && editTarget && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">Editar agenda #{editTarget.id}</h2>
              <button className="modal-close" type="button" onClick={handleCloseEdit} disabled={editSubmitting}>
                ×
              </button>
            </div>
            {editError && <div className="modal-error">{editError}</div>}
            <form className="modal-form" onSubmit={handleEditSubmit}>
              <div className="modal-grid">
                <label className="modal-field">
                  <span>ID profesional</span>
                  <input type="text" name="idPersonalSalud" value={editForm.idPersonalSalud} onChange={handleEditInputChange} disabled={!isAdmin} />
                </label>
                <label className="modal-field">
                  <span>Cupos totales</span>
                  <input type="number" min={0} name="cupos" value={editForm.cupos} onChange={handleEditInputChange} />
                </label>
                <label className="modal-field">
                  <span>Fecha inicio</span>
                  <input type="date" name="fechaInicio" value={editForm.fechaInicio} onChange={handleEditInputChange} />
                </label>
                <label className="modal-field">
                  <span>Fecha fin</span>
                  <input type="date" name="fechaFin" value={editForm.fechaFin} onChange={handleEditInputChange} min={editForm.fechaInicio || undefined} />
                </label>
                <label className="modal-field">
                  <span>Cupos disponibles</span>
                  <input type="number" min={0} name="cuposDisponibles" value={editForm.cuposDisponibles} onChange={handleEditInputChange} />
                </label>
              </div>
              <div className="blocks-editor">
                <div className="blocks-editor-header">
                  <span>Bloques horarios</span>
                  <button type="button" className="btn-ghost" onClick={() => addBlock('edit')}>
                    + Agregar bloque
                  </button>
                </div>
                {editForm.blocks.length === 0 && <div className="blocks-empty">Agrega al menos un bloque.</div>}
                {editForm.blocks.map((block, index) => (
                  <div key={`edit-block-${index}`} className="blocks-row">
                    <input type="time" value={block.horaInicio} onChange={(event) => updateBlockValue('edit', index, 'horaInicio', event.target.value)} />
                    <input type="time" value={block.horaFin} onChange={(event) => updateBlockValue('edit', index, 'horaFin', event.target.value)} />
                    <input type="number" min={0} value={block.cupos} onChange={(event) => updateBlockValue('edit', index, 'cupos', event.target.value)} placeholder="Cupos" />
                    <button type="button" className="btn-remove" onClick={() => removeBlock('edit', index)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={handleCloseEdit} disabled={editSubmitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-create" disabled={editSubmitting}>
                  {editSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-backdrop">
          <div className="modal-panel">
            <div className="modal-header">
              <h2 className="modal-title">Eliminar agenda #{deleteTarget.id}</h2>
              <button className="modal-close" type="button" onClick={handleDeleteCancel} disabled={deleteLoading}>
                ×
              </button>
            </div>
            {deleteError && <div className="modal-error">{deleteError}</div>}
            <p>Esta acción eliminará la agenda y sus cupos publicados. ¿Deseas continuar?</p>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={handleDeleteCancel} disabled={deleteLoading}>
                Cancelar
              </button>
              <button type="button" className="btn-danger" onClick={handleDeleteConfirm} disabled={deleteLoading}>
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaProfesionalAdmin;



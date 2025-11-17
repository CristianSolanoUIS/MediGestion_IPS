import { request } from './httpClient';

export interface PqrsItem {
  id: number | string;
  codigo: string;
  pacienteId?: number | null;
  tipo?: string | null;
  estado?: string | null;
  fechaRadicado?: string | null;
  sla?: string | null;
  responsable?: string | null;
  responsableId?: number | null;
  fechaCompromiso?: string | null;
  descripcion?: string | null;
  actualizadoEn?: string | null;
}

export interface ListarPQRSParams {
  estado?: string;
  tipo?: string;
  responsableId?: number;
  pacienteId?: number;
}

export interface ActualizarPQRSBody {
  estado?: string;
  responsableId?: number;
  fechaCompromiso?: string;
  observaciones?: string;
}

export interface CrearPQRSBody {
  tipo: string;
  idPaciente: number | string;
  estado?: string;
  fechaRadicado?: string;
  sla?: string;
  idCita?: number | string | null;
  responsable?: string;
  fechaCompromiso?: string;
}

const toStringSafe = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
};

const toNumberSafe = (value: unknown): number | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const toNonEmpty = (value: unknown): string | null => {
  const text = toStringSafe(value).trim();
  return text.length ? text : null;
};

const ensureArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidates = [record.items, record.data, record.results, record.content, record.pqrs];
    for (const option of candidates) {
      if (Array.isArray(option)) {
        return option;
      }
    }
  }
  return [];
};

const normalizePqrsRecord = (payload: unknown): PqrsItem | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const record = payload as Record<string, unknown>;
  const resolvedId = record.id ?? record.idPQRS ?? record.pqrsId ?? record.codigo ?? record.codigoPQRS;
  const stringId = toStringSafe(resolvedId);
  if (!stringId) {
    return null;
  }
  const numericId = toNumberSafe(resolvedId);
  const pacienteId = toNumberSafe(record.idPaciente ?? record.pacienteId ?? record.paciente);
  const responsableId = toNumberSafe(record.responsableId ?? record.idResponsable ?? record.responsable);
  const responsableNombre = toNonEmpty(record.responsableNombre ?? record.responsable ?? record.asignadoA ?? record.asignadoAUsuario);
  const slaRaw = record.sla ?? record.slaDias ?? record.tiempoRespuesta;
  const estado = toNonEmpty(record.estado ?? record.estadoActual ?? record.estadoPQRS ?? record.estadoDescripcion);
  const tipo = toNonEmpty(record.tipo ?? record.tipoPQRS ?? record.categoria ?? record.clase);

  return {
    id: numericId ?? stringId,
    codigo: stringId.startsWith('PQRS') ? stringId : `PQRS-${stringId}`,
    pacienteId,
    tipo,
    estado,
    fechaRadicado: toNonEmpty(record.fechaRadicado ?? record.fechaCreacion ?? record.createdAt ?? record.fechaRegistro),
    sla: slaRaw !== undefined && slaRaw !== null ? toStringSafe(slaRaw) : null,
    responsable: responsableNombre,
    responsableId,
    fechaCompromiso: toNonEmpty(record.fechaCompromiso ?? record.fechaLimite ?? record.dueDate ?? record.fechaComprometida),
    descripcion: toNonEmpty(record.descripcion ?? record.detalle ?? record.descripcionDetallada ?? record.comentarios ?? record.motivo ?? record.body),
    actualizadoEn: toNonEmpty(record.fechaActualizacion ?? record.updatedAt ?? record.ultimaActualizacion ?? record.modificadoEn)
  };
};

export async function listarPQRS(params: ListarPQRSParams = {}, signal?: AbortSignal): Promise<PqrsItem[]> {
  const query: Record<string, string | number | boolean | null | undefined> = {};
  if (params.estado) {
    query.estado = params.estado;
  }
  if (params.tipo) {
    query.tipo = params.tipo;
  }
  if (params.responsableId !== undefined && params.responsableId !== null) {
    query.responsableId = params.responsableId;
  }
  if (params.pacienteId !== undefined && params.pacienteId !== null) {
    query.pacienteId = params.pacienteId;
  }

  const response = await request<unknown>('/pqrs', {
    method: 'GET',
    query,
    signal
  });

  return ensureArray(response)
    .map((item) => normalizePqrsRecord(item))
    .filter((item): item is PqrsItem => Boolean(item));
}

export async function actualizarPQRS(id: number | string, body: ActualizarPQRSBody, signal?: AbortSignal): Promise<PqrsItem> {
  const response = await request<unknown>(`/pqrs/${id}`, {
    method: 'PATCH',
    body,
    signal
  });

  const normalized = normalizePqrsRecord(response);
  if (!normalized) {
    throw new Error('No fue posible actualizar la PQRS.');
  }
  return normalized;
}

export async function crearPQRS(body: CrearPQRSBody, signal?: AbortSignal): Promise<PqrsItem> {
  const numericIdPaciente = Number(body.idPaciente);
  if (!Number.isInteger(numericIdPaciente)) {
    throw new Error('No fue posible identificar al paciente autenticado.');
  }

  const payload: Record<string, unknown> = {
    tipo: body.tipo,
    idPaciente: numericIdPaciente
  };

  const optionalEntries: Array<[string, string]> = [
    ['estado', body.estado ?? ''],
    ['fechaRadicado', body.fechaRadicado ?? ''],
    ['sla', body.sla ?? ''],
    ['responsable', body.responsable ?? ''],
    ['fechaCompromiso', body.fechaCompromiso ?? '']
  ];

  optionalEntries.forEach(([key, value]) => {
    const text = toNonEmpty(value);
    if (text) {
      payload[key] = text;
    }
  });

  if (body.idCita !== undefined && body.idCita !== null && body.idCita !== '') {
    const numericIdCita = Number(body.idCita);
    if (Number.isInteger(numericIdCita)) {
      payload.idCita = numericIdCita;
    }
  }

  const response = await request<unknown>('/pqrs', {
    method: 'POST',
    body: payload,
    signal
  });

  const normalized = normalizePqrsRecord(response);
  if (!normalized) {
    throw new Error('No fue posible registrar tu PQRS.');
  }
  return normalized;
}

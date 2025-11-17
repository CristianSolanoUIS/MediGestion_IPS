import { request } from './httpClient';

export type NotificacionIcono = 'calendar' | 'check' | 'info';

export interface NotificacionItem {
  id: number | string;
  tipo: string;
  titulo: string;
  mensaje: string;
  estado: string;
  fechaCreacion: string | null;
  leidaEn: string | null;
  metadataTexto: string | null;
  prioridad?: string | null;
  icono: NotificacionIcono;
}

export interface ActualizarNotificacionBody {
  estado?: string;
  leida?: boolean;
  fechaLectura?: string | null;
}

const toStringSafe = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
};

const toNullableString = (value: unknown): string | null => {
  const text = toStringSafe(value).trim();
  return text.length ? text : null;
};

const ensureArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidates = [record.items, record.data, record.results, record.content, record.notificaciones];
    for (const option of candidates) {
      if (Array.isArray(option)) {
        return option;
      }
    }
  }
  return [];
};

const parseDateSafe = (value: unknown): string | null => {
  const text = toNullableString(value);
  if (!text) {
    return null;
  }
  const timestamp = Date.parse(text);
  if (Number.isNaN(timestamp)) {
    return text;
  }
  return new Date(timestamp).toISOString();
};

const parseMetadata = (value: unknown): string | null => {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed.length) {
      return null;
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') {
        return JSON.stringify(parsed, null, 2);
      }
    } catch {
      // keep raw string
    }
    return trimmed;
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return toStringSafe(value);
    }
  }
  return String(value);
};

const normalizeEstado = (value: unknown): string => {
  const text = toStringSafe(value).trim();
  if (!text && typeof value === 'boolean') {
    return value ? 'LEIDA' : 'NO LEIDA';
  }
  if (!text) {
    return 'SIN ESTADO';
  }
  return text.replace(/_/g, ' ').toUpperCase();
};

const guessIcono = (tipo: string | null | undefined): NotificacionIcono => {
  const base = (tipo ?? '').toLowerCase();
  if (base.includes('record') || base.includes('cita')) {
    return 'calendar';
  }
  if (base.includes('confirm') || base.includes('check') || base.includes('aprob')) {
    return 'check';
  }
  return 'info';
};

const normalizeNotificacion = (payload: unknown): NotificacionItem | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const record = payload as Record<string, unknown>;
  const resolvedId = record.id ?? record.idNotificacion ?? record.notificacionId ?? record.uuid ?? record.codigo;
  const idTexto = toNullableString(resolvedId);
  if (!idTexto) {
    return null;
  }

  const tipo = toNullableString(record.tipo ?? record.tipoNotificacion ?? record.category ?? record.clase) ?? 'General';
  const titulo = toNullableString(record.titulo ?? record.title ?? record.asunto ?? record.subject) ?? 'Notificación';
  const mensaje = toNullableString(record.mensaje ?? record.descripcion ?? record.description ?? record.body) ?? '';
  const estado = normalizeEstado(record.estado ?? record.status ?? (record.leida === true ? 'LEIDA' : 'NO LEIDA'));
  const fechaCreacion = parseDateSafe(record.fechaCreacion ?? record.creadaEn ?? record.createdAt ?? record.fecha ?? record.fechaRegistro);
  const leidaEn = parseDateSafe(record.leidaEn ?? record.fechaLectura ?? record.readAt);
  const metadataTexto = parseMetadata(record.metadata ?? record.meta ?? record.datos ?? record.data ?? record.payload);
  const prioridad = toNullableString(record.prioridad ?? record.importancia ?? record.severidad);
  const icono = guessIcono(record.icono ? toStringSafe(record.icono) : tipo);

  const numericId = Number(idTexto);
  const id = Number.isFinite(numericId) ? numericId : idTexto;

  return {
    id,
    tipo,
    titulo,
    mensaje,
    estado,
    fechaCreacion,
    leidaEn,
    metadataTexto,
    prioridad,
    icono
  };
};

export async function listarMisNotificaciones(signal?: AbortSignal): Promise<NotificacionItem[]> {
  const response = await request<unknown>('/notificaciones', {
    method: 'GET',
    signal
  });

  return ensureArray(response)
    .map((item) => normalizeNotificacion(item))
    .filter((item): item is NotificacionItem => Boolean(item));
}

export async function actualizarNotificacion(id: number | string, body: ActualizarNotificacionBody, signal?: AbortSignal): Promise<NotificacionItem> {
  const response = await request<unknown>(`/notificaciones/${id}`, {
    method: 'PATCH',
    body,
    signal
  });

  const normalized = normalizeNotificacion(response);
  if (!normalized) {
    throw new Error('No fue posible actualizar la notificación.');
  }
  return normalized;
}

export async function marcarNotificacionLeida(id: number | string, signal?: AbortSignal): Promise<NotificacionItem> {
  return actualizarNotificacion(id, { estado: 'LEIDA', leida: true, fechaLectura: new Date().toISOString() }, signal);
}

export async function marcarNotificacionNoLeida(id: number | string, signal?: AbortSignal): Promise<NotificacionItem> {
  return actualizarNotificacion(id, { estado: 'NO LEIDA', leida: false, fechaLectura: null }, signal);
}

export const estaLeida = (notificacion: NotificacionItem): boolean => {
  const normalized = notificacion.estado.replace(/_/g, ' ').toLowerCase();
  return normalized.includes('leida') && !normalized.includes('no leida');
};

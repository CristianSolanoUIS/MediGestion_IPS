import { request } from './httpClient';

export interface AgendaBlock {
  horaInicio: string;
  horaFin: string;
  cupos?: number;
  dias?: string[];
  etiqueta?: string;
  [key: string]: unknown;
}

export type BloquesInput = string | AgendaBlock[] | null | undefined;

export interface AgendaPayload {
  idPersonalSalud: number;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  cupos: number;
  cuposDisponibles?: number;
  bloques?: BloquesInput;
}

export interface UpdateAgendaPayload {
  idPersonalSalud?: number;
  fechaInicio?: string;
  fechaFin?: string;
  cupos?: number;
  cuposDisponibles?: number;
  bloques?: BloquesInput;
}

export interface PersonalSaludInfo {
  id?: number;
  nombre?: string;
  apellido?: string;
  documento?: string;
  [key: string]: unknown;
}

export interface AgendaResponse {
  id: number;
  idPersonalSalud: number | null;
  fechaInicio: string;
  fechaFin: string;
  cupos: number;
  cuposDisponibles?: number | null;
  bloques?: BloquesInput;
  personalSalud?: PersonalSaludInfo | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface ListAgendasParams {
  desde?: string;
  hasta?: string;
  profesionalId?: number | string;
}

type RawAgenda = Record<string, unknown> | null | undefined;

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const toStringSafe = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
};

const serializeBloques = (value: BloquesInput): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value)) {
    const normalized = value
      .filter((block) => Boolean(block?.horaInicio) && Boolean(block?.horaFin))
      .map((block) => ({
        horaInicio: toStringSafe(block.horaInicio).slice(0, 8),
        horaFin: toStringSafe(block.horaFin).slice(0, 8),
        cupos: block.cupos ?? undefined,
        dias: Array.isArray(block.dias) ? block.dias : undefined,
        etiqueta: block.etiqueta
      }));
    if (!normalized.length) {
      return undefined;
    }
    return JSON.stringify(normalized);
  }
  return undefined;
};

const parseBloques = (value: unknown): BloquesInput => {
  if (!value) {
    return undefined;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed as AgendaBlock[];
      }
    } catch (_) {
      // ignored, return raw string below
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value as AgendaBlock[];
  }
  return undefined;
};

const normalizeAgenda = (raw: RawAgenda): AgendaResponse | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const id = toNumber((raw as Record<string, unknown>).id ?? (raw as Record<string, unknown>).agendaId ?? (raw as Record<string, unknown>).idAgenda);
  const ownerId = toNumber(
    (raw as Record<string, unknown>).idPersonalSalud ??
      (raw as Record<string, unknown>).personalSaludId ??
      (raw as Record<string, unknown>).profesionalId ??
      (raw as Record<string, unknown>).idPersonal
  );
  const rawBloques = (raw as Record<string, unknown>).bloques ?? (raw as Record<string, unknown>).bloquesHorarios ?? (raw as Record<string, unknown>).blocks;
  const parsedBloques = (parseBloques(rawBloques) ?? (rawBloques as unknown)) as BloquesInput;

  const agenda: AgendaResponse = {
    id: id ?? 0,
    idPersonalSalud: ownerId,
    fechaInicio: toStringSafe((raw as Record<string, unknown>).fechaInicio ?? ''),
    fechaFin: toStringSafe((raw as Record<string, unknown>).fechaFin ?? ''),
    cupos: toNumber((raw as Record<string, unknown>).cupos) ?? 0,
    cuposDisponibles: toNumber((raw as Record<string, unknown>).cuposDisponibles) ?? null,
    bloques: parsedBloques,
    personalSalud: (raw as Record<string, unknown>).personalSalud as PersonalSaludInfo | undefined,
    createdAt: toStringSafe((raw as Record<string, unknown>).createdAt ?? '') || null,
    updatedAt: toStringSafe((raw as Record<string, unknown>).updatedAt ?? '') || null
  };

  return agenda;
};

const ensureArray = (payload: unknown): RawAgenda[] => {
  if (Array.isArray(payload)) {
    return payload as RawAgenda[];
  }
  if (payload && typeof payload === 'object') {
    const container = payload as Record<string, unknown>;
    const keys = ['items', 'data', 'results', 'agendas'];
    for (const key of keys) {
      const segment = container[key];
      if (Array.isArray(segment)) {
        return segment as RawAgenda[];
      }
    }
  }
  return [];
};

const withSerializedBloques = <T extends AgendaPayload | UpdateAgendaPayload>(payload: T): T => {
  const bloques = serializeBloques(payload.bloques);
  if (bloques === undefined) {
    const clone = { ...payload } as T;
    if ('bloques' in clone) {
      delete (clone as Record<string, unknown>).bloques;
    }
    return clone;
  }
  return { ...payload, bloques };
};

export async function crearAgenda(payload: AgendaPayload, signal?: AbortSignal): Promise<AgendaResponse> {
  const body = withSerializedBloques(payload);
  const response = await request<unknown>('/agendas', {
    method: 'POST',
    body,
    signal
  });
  return normalizeAgenda(response as RawAgenda) ?? {
    id: 0,
    idPersonalSalud: payload.idPersonalSalud,
    fechaInicio: payload.fechaInicio,
    fechaFin: payload.fechaFin,
    cupos: payload.cupos,
    bloques: payload.bloques
  };
}

export async function listarAgendas(params: ListAgendasParams = {}, signal?: AbortSignal): Promise<AgendaResponse[]> {
  const query: Record<string, string | number | boolean | undefined> = {};
  if (params.desde) query.desde = params.desde;
  if (params.hasta) query.hasta = params.hasta;
  if (params.profesionalId !== undefined && params.profesionalId !== '') query.profesionalId = params.profesionalId;

  const response = await request<unknown>('/agendas', {
    method: 'GET',
    query,
    signal
  });

  return ensureArray(response).map((item) => normalizeAgenda(item)).filter((agenda): agenda is AgendaResponse => Boolean(agenda));
}

export async function actualizarAgenda(id: number | string, payload: UpdateAgendaPayload, signal?: AbortSignal): Promise<AgendaResponse> {
  const body = withSerializedBloques(payload);
  const response = await request<unknown>(`/agendas/${id}`, {
    method: 'PATCH',
    body,
    signal
  });
  return normalizeAgenda(response as RawAgenda) ?? {
    id: typeof id === 'number' ? id : Number(id),
    idPersonalSalud: payload?.idPersonalSalud ?? null,
    fechaInicio: payload?.fechaInicio ?? '',
    fechaFin: payload?.fechaFin ?? '',
    cupos: payload?.cupos ?? 0,
    bloques: payload?.bloques
  };
}

export async function eliminarAgenda(id: number | string, signal?: AbortSignal): Promise<void> {
  await request(`/agendas/${id}`, {
    method: 'DELETE',
    signal
  });
}

export async function fetchAgendaPorId(id: number | string, signal?: AbortSignal): Promise<AgendaResponse> {
  const response = await request<unknown>(`/agendas/${id}`, {
    method: 'GET',
    signal
  });
  const agenda = normalizeAgenda(response as RawAgenda);
  if (agenda) {
    return agenda;
  }
  return {
    id: typeof id === 'number' ? id : Number(id),
    idPersonalSalud: null,
    fechaInicio: '',
    fechaFin: '',
    cupos: 0,
    bloques: undefined
  };
}

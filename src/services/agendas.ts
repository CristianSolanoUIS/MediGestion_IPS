import { request } from './httpClient';

export interface AgendaPayload {
  idPersonalSalud: number;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  cupos: number;
  cuposDisponibles?: number;
  bloques?: string;
}

export interface UpdateAgendaPayload {
  fechaInicio?: string;
  fechaFin?: string;
  cupos?: number;
  cuposDisponibles?: number;
  bloques?: string;
}

export interface AgendaResponse {
  id: number;
  idPersonalSalud: number;
  fechaInicio: string;
  fechaFin: string;
  cupos: number;
  cuposDisponibles?: number;
  bloques?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ListAgendasParams {
  desde?: string;
  hasta?: string;
  profesionalId?: number | string;
}

export async function crearAgenda(payload: AgendaPayload, signal?: AbortSignal): Promise<AgendaResponse> {
  return request<AgendaResponse>('/agendas', {
    method: 'POST',
    body: payload,
    signal
  });
}

export async function listarAgendas(params: ListAgendasParams = {}, signal?: AbortSignal): Promise<AgendaResponse[]> {
  const query: Record<string, string | number | boolean | undefined> = {};
  if (params.desde) query.desde = params.desde;
  if (params.hasta) query.hasta = params.hasta;
  if (params.profesionalId !== undefined) query.profesionalId = params.profesionalId;

  return request<AgendaResponse[]>('/agendas', {
    method: 'GET',
    query,
    signal
  });
}

export async function actualizarAgenda(id: number | string, payload: UpdateAgendaPayload, signal?: AbortSignal): Promise<AgendaResponse> {
  return request<AgendaResponse>(`/agendas/${id}`, {
    method: 'PATCH',
    body: payload,
    signal
  });
}

export async function eliminarAgenda(id: number | string, signal?: AbortSignal): Promise<void> {
  await request(`/agendas/${id}`, {
    method: 'DELETE',
    signal
  });
}

export async function fetchAgendaPorId(id: number | string, signal?: AbortSignal): Promise<AgendaResponse> {
  return request<AgendaResponse>(`/agendas/${id}`, {
    method: 'GET',
    signal
  });
}

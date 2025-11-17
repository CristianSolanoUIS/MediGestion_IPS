import { request } from './httpClient';

export interface CitaPayload {
  idPaciente: number;
  idPersonalSalud: number;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm:ss
  motivo?: string;
  notas?: string;
}

export interface ReprogramarCitaPayload {
  fecha: string;
  hora: string;
  motivo?: string;
}

export interface CancelarCitaPayload {
  motivo?: string;
}

export interface CitaDetalle {
  id: number;
  idPaciente: number;
  idPersonalSalud: number;
  fecha: string;
  hora: string;
  estado: string;
  motivo?: string;
  notas?: string;
  paciente?: Record<string, unknown>;
  profesional?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ListarCitasParams {
  profesionalId?: number;
  fecha?: string;
  estado?: string;
  pacienteId?: number;
}

export async function crearCita(payload: CitaPayload, signal?: AbortSignal): Promise<CitaDetalle> {
  return request<CitaDetalle>('/citas', {
    method: 'POST',
    body: payload,
    signal
  });
}

export async function listarCitas(params: ListarCitasParams = {}, signal?: AbortSignal): Promise<CitaDetalle[]> {
  const { profesionalId, fecha, estado, pacienteId } = params;
  return request<CitaDetalle[]>('/citas', {
    method: 'GET',
    query: {
      profesionalId,
      fecha,
      estado,
      pacienteId
    },
    signal
  });
}

export async function reprogramarCita(id: number | string, payload: ReprogramarCitaPayload, signal?: AbortSignal): Promise<CitaDetalle> {
  return request<CitaDetalle>(`/citas/${id}/reprogramar`, {
    method: 'PATCH',
    body: payload,
    signal
  });
}

export async function cancelarCita(id: number | string, payload: CancelarCitaPayload = {}, signal?: AbortSignal): Promise<CitaDetalle> {
  return request<CitaDetalle>(`/citas/${id}/cancelar`, {
    method: 'PATCH',
    body: payload,
    signal
  });
}

export async function confirmarCita(id: number | string, signal?: AbortSignal): Promise<CitaDetalle> {
  return request<CitaDetalle>(`/citas/${id}/confirmar`, {
    method: 'PATCH',
    signal
  });
}

export async function marcarCitaEnSala(id: number | string, signal?: AbortSignal): Promise<CitaDetalle> {
  return request<CitaDetalle>(`/citas/${id}/ensala`, {
    method: 'PATCH',
    signal
  });
}

export async function marcarCitaAtendida(id: number | string, signal?: AbortSignal): Promise<CitaDetalle> {
  return request<CitaDetalle>(`/citas/${id}/atender`, {
    method: 'PATCH',
    signal
  });
}

export async function marcarCitaNoAsistida(id: number | string, signal?: AbortSignal): Promise<CitaDetalle> {
  return request<CitaDetalle>(`/citas/${id}/no-asistio`, {
    method: 'PATCH',
    signal
  });
}

export async function fetchCitaPorId(id: number | string, signal?: AbortSignal): Promise<CitaDetalle> {
  return request<CitaDetalle>(`/citas/${id}`, {
    method: 'GET',
    signal
  });
}

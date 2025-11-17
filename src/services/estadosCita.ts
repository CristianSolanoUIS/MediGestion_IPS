import { request } from './httpClient';

export interface EstadoCita {
  id: number | string;
  codigo: string;
  nombre: string;
  colorHex?: string;
}

export async function listarEstadosCita(signal?: AbortSignal): Promise<EstadoCita[]> {
  return request<EstadoCita[]>('/estados-cita', {
    method: 'GET',
    signal
  });
}

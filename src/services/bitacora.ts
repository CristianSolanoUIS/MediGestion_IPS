import { request } from './httpClient';

export interface BitacoraEntry {
  idEvento: number;
  fechaHora: string; // ISO timestamp
  idUsuario?: number | null;
  seccion?: string | null;
  accion?: string | null;
  detalle?: unknown;
}

export const fetchBitacora = async (): Promise<BitacoraEntry[]> => {
  return await request<BitacoraEntry[]>('/bitacora');
};

export const fetchBitacoraById = async (id: number | string): Promise<BitacoraEntry> => {
  return await request<BitacoraEntry>(`/bitacora/${id}`);
};

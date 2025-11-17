import { API_BASE_URL } from '../config/env';
import { getAccessToken } from './authStorage';
import { HttpError, request } from './httpClient';

export interface ReportRecord {
  idReporte: number | string;
  idPaciente: number | string;
  idGeneradoPor: number | string;
  fechaGeneracion: string;
  descripcion?: string | null;
}

export interface FetchReportsParams {
  desde?: string;
  hasta?: string;
  profesionalId?: number | string;
  tipoPQRS?: string;
}

export interface CreateReportPayload {
  idPaciente: number;
  idGeneradoPor: number;
  descripcion?: string;
}

export interface UpdateReportPayload {
  descripcion?: string;
}

export interface ReportKpiPayload {
  citasTotales?: number;
  citasConfirmadas?: number;
  citasCanceladas?: number;
  citasPendientes?: number;
  pqrsTotales?: number;
  pqrsRespondidas?: number;
  pqrsPendientes?: number;
  [key: string]: number | undefined;
}

export interface ReportKpiParams extends FetchReportsParams {}

export interface ReportExportParams extends FetchReportsParams {
  tipo?: string;
}

const cleanQuery = (params: FetchReportsParams | ReportKpiParams | ReportExportParams = {}): Record<string, string> => {
  const query: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    query[key] = String(value);
  });
  return query;
};

export const fetchReports = (params: FetchReportsParams = {}): Promise<ReportRecord[]> =>
  request('/reportes', {
    query: cleanQuery(params)
  });

export const fetchReport = (id: number | string): Promise<ReportRecord> => request(`/reportes/${id}`);

export const createReport = (payload: CreateReportPayload): Promise<ReportRecord> =>
  request('/reportes', {
    method: 'POST',
    body: payload
  });

export const updateReport = (id: number | string, payload: UpdateReportPayload): Promise<ReportRecord> =>
  request(`/reportes/${id}`, {
    method: 'PATCH',
    body: payload
  });

export const deleteReport = (id: number | string): Promise<void> =>
  request(`/reportes/${id}`, {
    method: 'DELETE'
  });

export const fetchReportKpis = (params: ReportKpiParams = {}): Promise<ReportKpiPayload> =>
  request('/reportes/kpis', {
    query: cleanQuery(params)
  });

const buildExportUrl = (resource: string, format: 'csv' | 'json', params: ReportExportParams): string => {
  const cleanedEndpoint = `/reportes/${resource}.${format}`;
  const base = API_BASE_URL ?? '';
  const url = typeof window !== 'undefined'
    ? new URL(`${base}${cleanedEndpoint}`, window.location.origin)
    : new URL(`${base}${cleanedEndpoint}`, 'http://localhost');

  const searchParams = new URLSearchParams(cleanQuery(params));
  if ([...searchParams.keys()].length > 0) {
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
};

export const downloadReportExport = async (
  resource: 'citas' | 'pqrs',
  format: 'csv' | 'json',
  params: ReportExportParams = {}
): Promise<Blob> => {
  const url = buildExportUrl(resource, format, params);
  const headers = new Headers();
  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const message = response.statusText || 'No se pudo completar la descarga.';
    throw new HttpError(response.status, message);
  }

  return await response.blob();
};

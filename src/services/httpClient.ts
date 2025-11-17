import { API_BASE_URL } from '../config/env';
import { getAccessToken } from './authStorage';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type QueryValue = string | number | boolean | null | undefined;

type QueryParams = Record<string, QueryValue>;

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  query?: QueryParams;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
}

export interface ErrorPayload {
  message?: string;
  code?: string | number;
  [key: string]: unknown;
}

export class HttpError extends Error {
  status: number;
  details?: ErrorPayload | unknown;

  constructor(status: number, message: string, details?: ErrorPayload | unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json'
};

const DEFAULT_METHOD: HttpMethod = 'GET';

const DEFAULT_CREDENTIALS: RequestCredentials = 'include';

function buildUrl(endpoint: string, query?: QueryParams): string {
  const cleanedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const base = API_BASE_URL;
  const url = base ? `${base}${cleanedEndpoint}` : cleanedEndpoint;

  if (!query) {
    return url;
  }

  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function parseJsonSafe<T>(response: Response): Promise<T | undefined> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return undefined;
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    console.warn('No se pudo parsear la respuesta JSON', error);
    return undefined;
  }
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = DEFAULT_METHOD, body, headers, query, signal, credentials = DEFAULT_CREDENTIALS } = options;

  const url = buildUrl(endpoint, query);
  const requestHeaders = new Headers(DEFAULT_HEADERS);

  if (headers) {
    new Headers(headers).forEach((value, key) => {
      requestHeaders.set(key, value);
    });
  }

  const accessToken = getAccessToken();
  if (accessToken && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob) {
      requestBody = body;
    } else {
      if (!requestHeaders.has('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/json');
      }
      requestBody = JSON.stringify(body);
    }
  }

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal,
      credentials
    });
  } catch (error) {
    throw new HttpError(0, 'No fue posible conectar con el servidor', error);
  }

  if (!response.ok) {
    const errorBody = await parseJsonSafe<ErrorPayload>(response);
    const errorMessage = errorBody?.message ?? response.statusText ?? 'Error inesperado';
    throw new HttpError(response.status, errorMessage, errorBody ?? undefined);
  }

  if (response.status === 204 || response.status === 205) {
    return {} as T;
  }

  const data = await parseJsonSafe<T>(response);
  return (data ?? ({} as T));
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

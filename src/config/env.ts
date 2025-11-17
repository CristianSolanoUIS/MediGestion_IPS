const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim();
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const isApiConfigured = API_BASE_URL.length > 0;

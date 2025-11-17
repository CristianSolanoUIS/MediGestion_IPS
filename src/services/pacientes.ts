import { request } from './httpClient';

export interface PacienteResumen {
  id: number;
  documento?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string | null;
  correo?: string | null;
  [key: string]: unknown;
}

const toStringSafe = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
};

const normalizePaciente = (payload: unknown): PacienteResumen | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const record = payload as Record<string, unknown>;
  const idRaw = record.id ?? record.idUsuario ?? record.pacienteId;
  const id = typeof idRaw === 'number' ? idRaw : parseInt(toStringSafe(idRaw), 10);
  if (!Number.isFinite(id)) {
    return null;
  }
  const nombres = toStringSafe(record.nombre ?? record.nombres ?? record.primerNombre).trim();
  const apellidos = toStringSafe(record.apellido ?? record.apellidos ?? record.primerApellido).trim();
  return {
    id,
    documento: toStringSafe(record.documento ?? record.numeroDocumento ?? record.identificacion).trim(),
    nombre: nombres,
    apellido: apellidos,
    telefono: (record.telefono ?? record.celular ?? record.telefonoContacto) as string | null | undefined,
    correo: (record.email ?? record.correo ?? record.correoElectronico) as string | null | undefined,
    ...record
  };
};

const ensureArray = (payload: unknown): PacienteResumen[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => normalizePaciente(item)).filter(Boolean) as PacienteResumen[];
  }
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const containers = [record.items, record.data, record.results, record.pacientes];
    for (const container of containers) {
      if (Array.isArray(container)) {
        return container.map((item) => normalizePaciente(item)).filter(Boolean) as PacienteResumen[];
      }
    }
    const normalized = normalizePaciente(payload);
    return normalized ? [normalized] : [];
  }
  return [];
};

export async function buscarPacientePorDocumento(documento: string, signal?: AbortSignal): Promise<PacienteResumen | null> {
  const trimmed = documento.trim();
  if (!trimmed) {
    return null;
  }
  const response = await request<unknown>('/pacientes', {
    method: 'GET',
    query: { documento: trimmed },
    signal
  });
  const resultados = ensureArray(response);
  if (!resultados.length) {
    return null;
  }
  const exact = resultados.find((paciente) => paciente.documento?.replace(/\D+/g, '') === trimmed.replace(/\D+/g, ''));
  return exact ?? resultados[0];
}

export async function buscarPacientePorCorreo(correo: string, signal?: AbortSignal): Promise<PacienteResumen | null> {
  const trimmed = correo.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }
  const response = await request<unknown>('/pacientes', {
    method: 'GET',
    query: { correo: trimmed },
    signal
  });
  const resultados = ensureArray(response);
  if (!resultados.length) {
    return null;
  }
  const exact = resultados.find((paciente) => (paciente.correo ?? '').toLowerCase() === trimmed);
  if (exact) {
    return exact;
  }
  return resultados[0];
}

export async function fetchPacientePorId(id: number | string, signal?: AbortSignal): Promise<PacienteResumen | null> {
  if (id === undefined || id === null || id === '') {
    return null;
  }
  const response = await request<unknown>(`/pacientes/${id}`, {
    method: 'GET',
    signal
  });
  return normalizePaciente(response);
}

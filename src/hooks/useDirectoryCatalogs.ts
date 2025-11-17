import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPacientes, fetchPersonalSalud, type PacienteProfile, type PersonalSaludProfile } from '../services/directorUsers';
import { isHttpError } from '../services/httpClient';

interface DirectoryCatalogsState {
  pacientes: PacienteProfile[];
  profesionales: PersonalSaludProfile[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface DirectoryCatalogsOptions {
  includePacientes?: boolean;
  includeProfesionales?: boolean;
}

const defaultOptions: Required<DirectoryCatalogsOptions> = {
  includePacientes: true,
  includeProfesionales: true
};

const useDirectoryCatalogs = (options: DirectoryCatalogsOptions = {}): DirectoryCatalogsState => {
  const { includePacientes, includeProfesionales } = { ...defaultOptions, ...options };
  const isMountedRef = useRef(true);
  const [pacientes, setPacientes] = useState<PacienteProfile[]>([]);
  const [profesionales, setProfesionales] = useState<PersonalSaludProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!isMountedRef.current) {
      return;
    }
    if (!includePacientes && !includeProfesionales) {
      setPacientes([]);
      setProfesionales([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [pacientesPayload, profesionalesPayload] = await Promise.all([
        includePacientes ? fetchPacientes() : Promise.resolve(null),
        includeProfesionales ? fetchPersonalSalud() : Promise.resolve(null)
      ]);

      if (!isMountedRef.current) {
        return;
      }

      if (includePacientes) {
        setPacientes(Array.isArray(pacientesPayload) ? (pacientesPayload as PacienteProfile[]) : []);
      }
      if (includeProfesionales) {
        setProfesionales(Array.isArray(profesionalesPayload) ? (profesionalesPayload as PersonalSaludProfile[]) : []);
      }
    } catch (caught) {
      if (!isMountedRef.current) {
        return;
      }
      const message = isHttpError(caught)
        ? caught.message
        : caught instanceof Error
          ? caught.message
          : 'No se pudo cargar la información de usuarios.';
      setError(message);
      if (includePacientes) {
        setPacientes([]);
      }
      if (includeProfesionales) {
        setProfesionales([]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [includePacientes, includeProfesionales]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    pacientes,
    profesionales,
    isLoading,
    error,
    refresh
  };
};

export default useDirectoryCatalogs;

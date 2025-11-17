import React from 'react';
import { type PacienteProfile } from '../../services/directorUsers';

interface PatientSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  pacientes: PacienteProfile[];
  isLoading?: boolean;
  loadingLabel?: string;
  emptyLabel?: string;
  placeholder?: string;
  /** When false, option labels show only the patient's name */
  showExtraInOptions?: boolean;
}

const PatientSelect: React.FC<PatientSelectProps> = ({
  value,
  onChange,
  pacientes,
  isLoading = false,
  loadingLabel = 'Cargando pacientes...',
  emptyLabel = 'Sin pacientes disponibles',
  placeholder = 'Selecciona un paciente',
  showExtraInOptions = true,
  disabled,
  className,
  ...rest
}) => {
  const isDisabled = disabled || isLoading || pacientes.length === 0;
  const combinedClassName = ['directory-select', className].filter(Boolean).join(' ').trim();
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={isDisabled}
      className={combinedClassName}
      {...rest}
    >
      <option value="">
        {isLoading ? loadingLabel : pacientes.length === 0 ? emptyLabel : placeholder}
      </option>
      {pacientes.map((paciente) => {
        const nombre = paciente.usuario?.nombre ?? `Paciente ${paciente.idUsuario}`;
        const historia = paciente.idHistoriaClinica ? ` · HC ${paciente.idHistoriaClinica}` : '';
        const label = showExtraInOptions ? `${nombre}${historia}` : nombre;
        return (
          <option key={paciente.idUsuario} value={paciente.idUsuario}>
            {label}
          </option>
        );
      })}
    </select>
  );
};

export default PatientSelect;

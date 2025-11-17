import React from 'react';
import { type PersonalSaludProfile } from '../../services/directorUsers';

interface ProfessionalSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  profesionales: PersonalSaludProfile[];
  isLoading?: boolean;
  loadingLabel?: string;
  emptyLabel?: string;
  placeholder?: string;
  /** showEmailInOptions: when true, option labels include email and specialty; when false, show only name */
  showEmailInOptions?: boolean;
}

const ProfessionalSelect: React.FC<ProfessionalSelectProps> = ({
  value,
  onChange,
  profesionales,
  isLoading = false,
  loadingLabel = 'Cargando profesionales...',
  emptyLabel = 'Sin profesionales disponibles',
  placeholder = 'Selecciona un profesional',
  showEmailInOptions = true,
  disabled,
  className,
  ...rest
}) => {
  const isDisabled = disabled || isLoading || profesionales.length === 0;
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
        {isLoading ? loadingLabel : profesionales.length === 0 ? emptyLabel : placeholder}
      </option>
      {profesionales.map((profesional) => {
        const nombre = profesional.usuario?.nombre ?? `Usuario ${profesional.idUsuario}`;
        const email = profesional.usuario?.email ? ` · ${profesional.usuario.email}` : '';
        const especialidad = profesional.especialidad ? ` · ${profesional.especialidad}` : '';
        const label = showEmailInOptions ? `${nombre}${email}${especialidad}` : nombre;
        return (
          <option key={profesional.idUsuario} value={profesional.idUsuario}>
            {label}
          </option>
        );
      })}
    </select>
  );
};

export default ProfessionalSelect;

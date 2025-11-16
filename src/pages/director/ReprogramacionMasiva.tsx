import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDirector from '../../components/NavbarDirector';
import '../../styles/DirectorPortal.css';
import './ReprogramacionMasiva.css';

interface CitaAfectada {
  idCita: string;
  paciente: string;
  idPaciente: number;
  idPersonal: string;
  fecha: string;
  hora: string;
  estado: string;
  motivo: string;
}

const ReprogramacionMasiva: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCitas, setSelectedCitas] = useState<string[]>([]);

  const citasAfectadas: CitaAfectada[] = [
    {
      idCita: 'C-10250',
      paciente: 'Paciente 1',
      idPaciente: 1001,
      idPersonal: 'PS-201',
      fecha: '2025-11-25',
      hora: '10:00:00',
      estado: 'Confirmada',
      motivo: 'Cambio de agenda profesional',
    },
    {
      idCita: 'C-10251',
      paciente: 'Paciente 2',
      idPaciente: 1002,
      idPersonal: 'PS-201',
      fecha: '2025-11-25',
      hora: '11:00:00',
      estado: 'Confirmada',
      motivo: 'Cambio de agenda profesional',
    },
    {
      idCita: 'C-10252',
      paciente: 'Paciente 3',
      idPaciente: 1003,
      idPersonal: 'PS-201',
      fecha: '2025-11-26',
      hora: '14:00:00',
      estado: 'Confirmada',
      motivo: 'Cambio de agenda profesional',
    },
  ];

  const handleToggleCita = (idCita: string): void => {
    setSelectedCitas((prev) =>
      prev.includes(idCita) ? prev.filter((id) => id !== idCita) : [...prev, idCita]
    );
  };

  const handleReprogramar = (): void => {
    console.log('Reprogramando citas:', selectedCitas);
    // Aquí se manejaría la lógica de reprogramación
    navigate('/director/dashboard');
  };

  return (
    <div className="director-portal">
      <NavbarDirector />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/director/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="page-title">Reprogramación Masiva de Citas</h1>
              <p className="page-subtitle">Gestiona cambios masivos de agendas</p>
            </div>
          </div>
        </div>

        {/* Alerta superior */}
        <div className="alert-card">
          <div className="alert-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#F97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="alert-content">
            <h3 className="alert-title">Citas Afectadas por Reprogramación</h3>
            <p className="alert-text">
              Se han identificado {citasAfectadas.length} citas que requieren reprogramación debido a cambios en la agenda del profesional.
            </p>
          </div>
        </div>

        {/* Lista de citas afectadas */}
        <div className="citas-card">
          <h2 className="citas-card-title">Lista de Citas Afectadas</h2>
          <div className="citas-list">
            {citasAfectadas.map((cita) => (
              <div key={cita.idCita} className="cita-row">
                <div className="cita-row-left">
                  <input
                    type="checkbox"
                    className="cita-checkbox"
                    checked={selectedCitas.includes(cita.idCita)}
                    onChange={() => handleToggleCita(cita.idCita)}
                  />
                  <div className="cita-info">
                    <div className="cita-header-row">
                      <span className="cita-paciente">{cita.paciente}</span>
                      <span className="status-badge status-confirmed">{cita.estado}</span>
                    </div>
                    <div className="cita-details-row">
                      <div className="cita-details-column">
                        <div className="cita-detail-item">
                          <span className="cita-detail-label">ID Cita</span>
                          <span className="cita-detail-value">{cita.idCita}</span>
                        </div>
                        <div className="cita-detail-item">
                          <span className="cita-detail-label">Motivo Reprogramación</span>
                          <span className="cita-detail-value">{cita.motivo}</span>
                        </div>
                      </div>
                      <div className="cita-details-column">
                        <div className="cita-detail-item">
                          <span className="cita-detail-label">ID Paciente</span>
                          <span className="cita-detail-value">{cita.idPaciente}</span>
                        </div>
                        <div className="cita-detail-item">
                          <span className="cita-detail-label">ID Personal Salud</span>
                          <span className="cita-detail-value">{cita.idPersonal}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cita-row-right">
                  <div className="cita-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 4C2.89543 4 2 4.89543 2 6V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V6C18 4.89543 17.1046 4 16 4H4Z"
                        stroke="#999"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 2V6M6 2V6M2 10H18"
                        stroke="#999"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="cita-fecha-hora">
                    {cita.fecha} - {cita.hora}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones inferiores */}
        <div className="action-buttons-bar">
          <button className="btn-cancelar" onClick={() => navigate('/director/dashboard')}>
            Cancelar
          </button>
          <button
            className="btn-reprogramar"
            onClick={handleReprogramar}
            disabled={selectedCitas.length === 0}
          >
            Reprogramar Seleccionadas
          </button>
        </div>

        {/* Nota inferior */}
        <div className="note-card">
          <p className="note-text">
            <strong>Nota:</strong> Al reprogramar, se actualizarán los campos "fecha", "hora" y "motivoCancelacion" de la tabla CITA para las citas seleccionadas.
            Se notificará automáticamente a los pacientes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReprogramacionMasiva;



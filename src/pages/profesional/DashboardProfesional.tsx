import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarProfesional from '../../components/NavbarProfesional';
import '../../styles/ProfesionalPortal.css';
import './DashboardProfesional.css';

interface CitaDelDia {
  id: string;
  paciente: string;
  hora: string;
  estado: string;
}

const DashboardProfesional: React.FC = () => {
  const navigate = useNavigate();

  const citasDelDia: CitaDelDia[] = [
    {
      id: 'C-10234',
      paciente: 'Paciente 1',
      hora: '10:30:00',
      estado: 'Confirmada'
    },
    {
      id: 'C-10235',
      paciente: 'Paciente 2',
      hora: '11:30:00',
      estado: 'Pendiente'
    },
    {
      id: 'C-10236',
      paciente: 'Paciente 3',
      hora: '14:00:00',
      estado: 'Confirmada'
    }
  ];

  const fechaActual = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="profesional-portal">
      <NavbarProfesional />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="welcome-header">
          <h1 className="welcome-title">Dashboard Profesional</h1>
          <p className="welcome-subtitle">Gestiona tu agenda y pacientes</p>
        </div>

        {/* Tarjetas de métricas */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value metric-blue">[Placeholder]</div>
            <div className="metric-label">Citas del Día</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-green">[Placeholder]</div>
            <div className="metric-label">Atendidas</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-orange">[Placeholder]</div>
            <div className="metric-label">Pendientes</div>
          </div>
        </div>

        {/* Card Citas del Día */}
        <div className="citas-card">
          <h2 className="citas-card-title">Citas del Día - {fechaActual}</h2>
          <div className="citas-list">
            {citasDelDia.map((cita) => (
              <div key={cita.id} className="cita-row">
                <div className="cita-row-left">
                  <div className="cita-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 5V10L13.3333 11.6667M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="cita-info">
                    <div className="cita-paciente">{cita.paciente}</div>
                    <div className="cita-id">ID Cita: {cita.id}</div>
                  </div>
                </div>
                <div className="cita-row-right">
                  <div className="cita-hora">{cita.hora}</div>
                  <span className={`status-badge ${
                    cita.estado === 'Confirmada' ? 'status-confirmed' : 'status-pending'
                  }`}>
                    {cita.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de acciones principales */}
        <div className="actions-grid">
          <div className="action-card">
            <div className="action-card-header">
              <svg className="action-icon icon-blue" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V6C28 4.89543 27.1046 4 26 4H6Z" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4V8M10 4V8M4 12H28" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="action-card-title">Mi Agenda</h3>
            <p className="action-card-subtitle">Consulta tu agenda y disponibilidad</p>
            <button className="btn-primary-blue" onClick={() => navigate('/pro/agenda')}>
              Ver Agenda
            </button>
          </div>
          <div className="action-card">
            <div className="action-card-header">
              <svg className="action-icon icon-green" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6C6.89543 6 6 6.89543 6 8V24C6 25.1046 6.89543 26 8 26H24C25.1046 26 26 25.1046 26 24V8C26 6.89543 25.1046 6 24 6H8Z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 12H22M10 16H22M10 20H18" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="action-card-title">Historias Clínicas</h3>
            <p className="action-card-subtitle">Accede a los registros de tus pacientes</p>
            <button className="btn-primary-green" onClick={() => navigate('/pro/historias')}>
              Ver Historias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfesional;


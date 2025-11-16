import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PatientPortal.css';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="patient-portal">
      <Navbar />
      <div className="portal-content">
        {/* Encabezado de bienvenida */}
        <div className="welcome-header">
          <h1 className="welcome-title">¡Bienvenid@, Paciente!</h1>
          <p className="welcome-subtitle">Gestiona tus citas médicas</p>
        </div>

        {/* Card Próxima Cita */}
        <div className="next-appointment-card">
          <div className="card-header">
            <h2 className="card-title">Próxima Cita</h2>
            <span className="status-badge status-confirmed">Confirmada</span>
          </div>
          <div className="appointment-details">
            <div className="appointment-column-left">
              <div className="detail-item">
                <span className="detail-label">idCita</span>
                <span className="detail-value">xxxxx</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha</span>
                <span className="detail-value">xxxx-xx-xx</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Personal de Salud</span>
                <span className="detail-value highlight">Profesional 1 - Especialidad</span>
                <span className="detail-subvalue">Sede: xxxxx</span>
              </div>
            </div>
            <div className="appointment-column-right">
              <div className="detail-item">
                <span className="detail-label">Estado</span>
                <span className="detail-value">Confirmada</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hora</span>
                <span className="detail-value">xx:xx</span>
              </div>
            </div>
          </div>
          <div className="card-actions">
            <button className="btn-primary" onClick={() => navigate('/mis-citas')}>
              Ver Detalle
            </button>
            <button className="btn-secondary">
              Check-in
            </button>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="quick-actions-section">
          <h2 className="section-title">Acciones Rápidas</h2>
          <div className="quick-actions-grid">
            <div className="quick-action-card" onClick={() => navigate('/mis-citas')}>
              <svg className="action-icon icon-blue" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10C8 8.89543 8.89543 8 10 8H38C39.1046 8 40 8.89543 40 10V38C40 39.1046 39.1046 40 38 40H10C8.89543 40 8 39.1046 8 38V10Z" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M32 6V12M16 6V12M8 18H40" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="action-text">Mis Citas</span>
            </div>
            <div className="quick-action-card" onClick={() => navigate('/agendar-cita')}>
              <svg className="action-icon icon-green" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 8V40M8 24H40" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10C8 8.89543 8.89543 8 10 8H38C39.1046 8 40 8.89543 40 10V38C40 39.1046 39.1046 40 38 40H10C8.89543 40 8 39.1046 8 38V10Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="action-text">Agendar Cita</span>
            </div>
            <div className="quick-action-card" onClick={() => navigate('/notificaciones')}>
              <svg className="action-icon icon-orange" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C21.3905 4 19 5.39053 19 8C19 15 16 17 16 17H32C32 17 29 15 29 8C29 5.39053 26.6095 4 24 4Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M27.46 42C27.3108 42.3031 27.1019 42.5547 26.8512 42.7295C26.6004 42.9044 26.3162 42.9965 26.026 42.9965C25.7358 42.9965 25.4516 42.9044 25.2008 42.7295C24.9501 42.5547 24.7412 42.3031 24.592 42" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="action-text">Notificaciones</span>
            </div>
            <div className="quick-action-card" onClick={() => navigate('/pqrs')}>
              <svg className="action-icon icon-purple" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16H36C37.1046 16 38 16.8954 38 18V30C38 31.1046 37.1046 32 36 32H12C10.8954 32 10 31.1046 10 30V18C10 16.8954 10.8954 16 12 16Z" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 22L22 28L32 18" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="action-text">Radicar PQRS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


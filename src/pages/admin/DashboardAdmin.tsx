import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminPortal.css';
import './DashboardAdmin.css';

const DashboardAdmin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-portal">
      <NavbarAdmin />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="welcome-header">
          <h1 className="welcome-title">Dashboard Operativo</h1>
          <p className="welcome-subtitle">Gestión administrativa del sistema</p>
        </div>

        {/* Tarjetas de métricas */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value metric-blue">[Placeholder]</div>
            <div className="metric-label">Citas Hoy</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-green">[Placeholder]</div>
            <div className="metric-label">Check-ins</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-orange">[Placeholder]</div>
            <div className="metric-label">Pendientes</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-purple">[Placeholder]</div>
            <div className="metric-label">PQRS Activas</div>
          </div>
        </div>

        {/* Módulos de Gestión */}
        <div className="modules-section">
          <h2 className="section-title">Módulos de Gestión</h2>
          <div className="modules-grid">
            <div className="module-card">
              <div className="module-icon icon-blue">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 4C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V6C28 4.89543 27.1046 4 26 4H6Z" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 4V8M10 4V8M4 12H28" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="module-title">Gestión de Citas</h3>
              <p className="module-subtitle">Crear, editar y gestionar citas</p>
              <button className="btn-module-blue" onClick={() => navigate('/admin/citas')}>
                Acceder
              </button>
            </div>

            <div className="module-card">
              <div className="module-icon icon-green">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 6C6.89543 6 6 6.89543 6 8V24C6 25.1046 6.89543 26 8 26H24C25.1046 26 26 25.1046 26 24V8C26 6.89543 25.1046 6 24 6H8Z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 12H22M10 16H22M10 20H18" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="module-title">Agenda del Profesional</h3>
              <p className="module-subtitle">Consultar agendas disponibles</p>
              <button className="btn-module-green" onClick={() => navigate('/admin/agenda-profesional')}>
                Acceder
              </button>
            </div>

            <div className="module-card">
              <div className="module-icon icon-purple">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16L14.5 18.5L20 13" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="module-title">Check-in Recepción</h3>
              <p className="module-subtitle">Gestionar llegada de pacientes</p>
              <button className="btn-module-purple" onClick={() => navigate('/admin/checkin')}>
                Acceder
              </button>
            </div>

            <div className="module-card">
              <div className="module-icon icon-orange">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10C8 8.89543 8.89543 8 10 8H22C23.1046 8 24 8.89543 24 10V18C24 19.1046 23.1046 20 22 20H12L8 24V10Z" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 14H20M12 17H18" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="module-title">Gestión PQRS</h3>
              <p className="module-subtitle">Administrar solicitudes y quejas</p>
              <button className="btn-module-orange" onClick={() => navigate('/admin/pqrs')}>
                Acceder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;



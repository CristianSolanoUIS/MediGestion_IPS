import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDirector from '../../components/NavbarDirector';
import '../../styles/DirectorPortal.css';
import './DashboardDirector.css';

const DashboardDirector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="director-portal">
      <NavbarDirector />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="welcome-header">
          <h1 className="welcome-title">Dashboard del Director</h1>
          <p className="welcome-subtitle">Resumen ejecutivo y gestión estratégica</p>
        </div>

        {/* Tarjetas de métricas */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value metric-blue">[Placeholder]</div>
            <div className="metric-label">Total Pacientes</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-green">[Placeholder]</div>
            <div className="metric-label">Personal Activo</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-purple">[Placeholder]</div>
            <div className="metric-label">Citas Mes</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-orange">[Placeholder]</div>
            <div className="metric-label">Ocupación %</div>
          </div>
        </div>

        {/* Módulos de Gestión */}
        <div className="modules-section">
          <h2 className="section-title">Módulos de Gestión</h2>
          <div className="modules-grid">
            <div className="module-card">
              <div className="module-icon icon-blue">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 12C18.2091 12 20 10.2091 20 8C20 5.79086 18.2091 4 16 4C13.7909 4 12 5.79086 12 8C12 10.2091 13.7909 12 16 12Z"
                    stroke="#1A67FD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 24C8 20.6863 11.5817 18 16 18C20.4183 18 24 20.6863 24 24"
                    stroke="#1A67FD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24 12C25.1046 12 26 11.1046 26 10C26 8.89543 25.1046 8 24 8C22.8954 8 22 8.89543 22 10C22 11.1046 22.8954 12 24 12Z"
                    stroke="#1A67FD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M28 24C28 21.7909 26.2091 20 24 20"
                    stroke="#1A67FD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="module-title">Gestión de Usuarios</h3>
              <p className="module-subtitle">Administra usuarios y roles del sistema</p>
              <button className="btn-module-blue" onClick={() => navigate('/director/usuarios')}>
                Acceder
              </button>
            </div>

            <div className="module-card">
              <div className="module-icon icon-green">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 24L10 16L14 22L18 12L22 20L26 8"
                    stroke="#16A34A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 4H28C29.1046 4 30 4.89543 30 6V26C30 27.1046 29.1046 28 28 28H4C2.89543 28 2 27.1046 2 26V6C2 4.89543 2.89543 4 4 4Z"
                    stroke="#16A34A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="module-title">Reportes</h3>
              <p className="module-subtitle">Genera y consulta reportes del sistema</p>
              <button className="btn-module-green" onClick={() => navigate('/director/reportes')}>
                Acceder
              </button>
            </div>

            <div className="module-card">
              <div className="module-icon icon-purple">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 4C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V6C28 4.89543 27.1046 4 26 4H6Z"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 4V8M10 4V8M4 12H28"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M12 18H20M12 22H20" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="module-title">Reprogramación Masiva</h3>
              <p className="module-subtitle">Gestiona cambios masivos de citas</p>
              <button className="btn-module-purple" onClick={() => navigate('/director/reprogramacion')}>
                Acceder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDirector;



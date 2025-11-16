import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDirector from '../../components/NavbarDirector';
import '../../styles/DirectorPortal.css';
import './Reportes.css';

interface Reporte {
  idReporte: string;
  titulo: string;
  idPaciente: number | string;
  generadoPor: number | string;
  fechaGeneracion: string;
}

const Reportes: React.FC = () => {
  const navigate = useNavigate();

  const reportes: Reporte[] = [
    {
      idReporte: 'REP-001',
      titulo: 'Reporte mensual de citas y asistencia',
      idPaciente: 1001,
      generadoPor: 3000,
      fechaGeneracion: '2025-11-01 10:00:00',
    },
    {
      idReporte: 'REP-002',
      titulo: 'Análisis de ocupación por sede',
      idPaciente: 'N/A',
      generadoPor: 'PS-201',
      fechaGeneracion: '2025-11-05 14:30:00',
    },
    {
      idReporte: 'REP-003',
      titulo: 'Historia clínica completa paciente 1002',
      idPaciente: 1002,
      generadoPor: 3000,
      fechaGeneracion: '2025-11-10 09:15:00',
    },
  ];

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
              <h1 className="page-title">Reportes del Sistema</h1>
              <p className="page-subtitle">Consulta y genera reportes</p>
            </div>
          </div>
        </div>

        {/* Barra superior de acción */}
        <div className="reports-header">
          <span className="reports-label">Reportes disponibles</span>
          <button className="btn-generar-reporte">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 3H15C15.5523 3 16 3.44772 16 4V14C16 14.5523 15.5523 15 15 15H3C2.44772 15 2 14.5523 2 14V4C2 3.44772 2.44772 3 3 3Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M6 8H12M6 11H10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Generar Nuevo Reporte
          </button>
        </div>

        {/* Lista de reportes */}
        <div className="reportes-list">
          {reportes.map((reporte) => (
            <div key={reporte.idReporte} className="reporte-card">
              <div className="reporte-content">
                <h3 className="reporte-titulo">{reporte.titulo}</h3>
                <div className="reporte-info">
                  <div className="reporte-info-column">
                    <div className="reporte-info-item">
                      <span className="reporte-info-label">ID Reporte:</span>
                      <span className="reporte-info-value">{reporte.idReporte}</span>
                    </div>
                    <div className="reporte-info-item">
                      <span className="reporte-info-label">ID Paciente:</span>
                      <span className="reporte-info-value">{reporte.idPaciente}</span>
                    </div>
                  </div>
                  <div className="reporte-info-column">
                    <div className="reporte-info-item">
                      <span className="reporte-info-label">Generado Por (ID):</span>
                      <span className="reporte-info-value">{reporte.generadoPor}</span>
                    </div>
                    <div className="reporte-info-item">
                      <span className="reporte-info-label">Fecha Generación:</span>
                      <span className="reporte-info-value">{reporte.fechaGeneracion}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn-descargar">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12V3M9 12L6 9M9 12L12 9"
                    stroke="#333"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M3 14H15" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Descargar
              </button>
            </div>
          ))}
        </div>

        {/* Card informativa de tablas de reportes */}
        <div className="info-card">
          <p className="info-text">
            <strong>Tabla REPORTE:</strong> idReporte, idPaciente, idGeneradoPor, descripcion, fechaGeneracion
          </p>
          <p className="info-text">
            <strong>Tabla DETALLEREPORTE:</strong> idDetalle, idReporte, idCita, observaciones
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reportes;



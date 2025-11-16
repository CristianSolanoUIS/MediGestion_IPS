import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarProfesional from '../../components/NavbarProfesional';
import '../../styles/ProfesionalPortal.css';
import './AgendaProfesional.css';

function AgendaProfesional() {
  const navigate = useNavigate();

  // Mock data
  const agendas = [
    {
      id: 'A-501',
      idPersonal: 'PS-201',
      fechaInicio: '2025-11-15',
      fechaFin: '2025-11-30',
      cuposTotales: 40,
      bloquesHorarios: '08:00-12:00, 14:00-18:00'
    },
    {
      id: 'A-505',
      idPersonal: 'PS-201',
      fechaInicio: '2025-12-01',
      fechaFin: '2025-12-15',
      cuposTotales: 35,
      bloquesHorarios: '09:00-13:00, 15:00-19:00'
    },
    {
      id: 'A-510',
      idPersonal: 'PS-201',
      fechaInicio: '2025-12-16',
      fechaFin: '2025-12-31',
      cuposTotales: 30,
      bloquesHorarios: '08:00-12:00, 14:00-18:00'
    }
  ];

  return (
    <div className="profesional-portal">
      <NavbarProfesional />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/pro/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div>
              <h1 className="page-title">Mi Agenda</h1>
              <p className="page-subtitle">Consulta tu disponibilidad</p>
            </div>
          </div>
        </div>

        {/* Lista de agendas */}
        <div className="agendas-list">
          {agendas.map((agenda) => (
            <div key={agenda.id} className="agenda-card">
              <div className="agenda-card-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 2C2.89543 2 2 2.89543 2 4V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V4C18 2.89543 17.1046 2 16 2H4Z" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V6M6 2V6M2 10H18" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="agenda-content">
                <div className="agenda-column-left">
                  <h3 className="agenda-title">{agenda.id}</h3>
                  <div className="agenda-details">
                    <div className="agenda-detail-item">
                      <span className="agenda-detail-label">ID Agenda</span>
                      <span className="agenda-detail-value">{agenda.id}</span>
                    </div>
                    <div className="agenda-detail-item">
                      <span className="agenda-detail-label">ID Personal Salud</span>
                      <span className="agenda-detail-value">{agenda.idPersonal}</span>
                    </div>
                    <div className="agenda-detail-item">
                      <span className="agenda-detail-label">Fecha Inicio</span>
                      <span className="agenda-detail-value">{agenda.fechaInicio}</span>
                    </div>
                    <div className="agenda-detail-item">
                      <span className="agenda-detail-label">Fecha Fin</span>
                      <span className="agenda-detail-value">{agenda.fechaFin}</span>
                    </div>
                  </div>
                </div>
                <div className="agenda-column-right">
                  <div className="agenda-detail-item">
                    <span className="agenda-detail-label">Cupos Totales</span>
                    <span className="agenda-detail-value highlight">{agenda.cuposTotales}</span>
                  </div>
                  <div className="agenda-detail-item">
                    <span className="agenda-detail-label">Bloques Horarios</span>
                    <span className="agenda-detail-value">{agenda.bloquesHorarios}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgendaProfesional;


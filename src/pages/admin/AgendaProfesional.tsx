import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminPortal.css';
import './AgendaProfesional.css';

interface AgendaAdmin {
  id: string;
  profesional: string;
  idPersonal: string;
  cuposTotales: number;
  fechaInicio: string;
  fechaFin: string;
  bloquesHorarios: string;
}

const AgendaProfesional: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProfesional, setSelectedProfesional] = useState<string>('');

  const agendas: AgendaAdmin[] = [
    {
      id: 'A-501',
      profesional: 'Profesional 1',
      idPersonal: 'PS-001',
      cuposTotales: 40,
      fechaInicio: '2025-11-15',
      fechaFin: '2025-11-30',
      bloquesHorarios: '08:00-12:00, 14:00-18:00',
    },
    {
      id: 'A-502',
      profesional: 'Profesional 2',
      idPersonal: 'PS-002',
      cuposTotales: 50,
      fechaInicio: '2025-11-20',
      fechaFin: '2025-12-05',
      bloquesHorarios: '09:00-13:00, 15:00-19:00',
    },
  ];

  const agendasFiltradas: AgendaAdmin[] = selectedProfesional
    ? agendas.filter((a) => a.idPersonal === selectedProfesional)
    : agendas;

  const handleProfesionalChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedProfesional(e.target.value);
  };

  return (
    <div className="admin-portal">
      <NavbarAdmin />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="page-title">Agenda del Profesional</h1>
              <p className="page-subtitle">Consulta disponibilidad de agendas</p>
            </div>
          </div>
        </div>

        {/* Card de filtro */}
        <div className="filter-card">
          <h3 className="filter-card-title">Filtrar por Profesional</h3>
          <select
            className="filter-select"
            value={selectedProfesional}
            onChange={handleProfesionalChange}
          >
            <option value="">Seleccione un profesional</option>
            <option value="PS-001">Profesional 1 (PS-001)</option>
            <option value="PS-002">Profesional 2 (PS-002)</option>
          </select>
        </div>

        {/* Lista de agendas */}
        <div className="agendas-list">
          {agendasFiltradas.map((agenda) => (
            <div key={agenda.id} className="agenda-card">
              <div className="agenda-id-badge">ID: {agenda.id}</div>
              <div className="agenda-content">
                <div className="agenda-column-left">
                  <h3 className="agenda-profesional-name">{agenda.profesional}</h3>
                  <div className="agenda-details">
                    <div className="agenda-detail-item">
                      <span className="agenda-detail-label">ID Personal Salud</span>
                      <span className="agenda-detail-value">{agenda.idPersonal}</span>
                    </div>
                    <div className="agenda-detail-item">
                      <span className="agenda-detail-label">Cupos Totales</span>
                      <span className="agenda-detail-value highlight">{agenda.cuposTotales}</span>
                    </div>
                  </div>
                </div>
                <div className="agenda-column-right">
                  <div className="agenda-detail-item">
                    <span className="agenda-detail-label">Fecha Inicio</span>
                    <span className="agenda-detail-value">{agenda.fechaInicio}</span>
                  </div>
                  <div className="agenda-detail-item">
                    <span className="agenda-detail-label">Fecha Fin</span>
                    <span className="agenda-detail-value">{agenda.fechaFin}</span>
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
};

export default AgendaProfesional;



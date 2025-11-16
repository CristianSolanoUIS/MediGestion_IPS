import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PatientPortal.css';
import './MisCitas.css';

function MisCitas() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('proximas');

  const citasProximas = [
    {
      id: 'xxxx',
      especialidad: 'xxxxxx',
      estado: 'xxxxxxx',
      fecha: 'xxxxxxx',
      hora: 'xxxxxxxxxx',
      profesional: 'xxxxxxxx'
    },
  ];

  const citasPasadas = [
    {
      id: 'yyyyy',
      especialidad: 'yyyyyy',
      estado: 'yyyyy',
      fecha: 'yyyyy',
      hora: 'yyyyyy',
      profesional: 'yyyyyy'
    }
  ];

  const citas = activeTab === 'proximas' ? citasProximas : citasPasadas;

  return (
    <div className="patient-portal">
      <Navbar />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/dashboard')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div>
              <h1 className="page-title">Mis Citas</h1>
              <p className="page-subtitle">Gestiona tus citas médicas</p>
            </div>
          </div>
        </div>

        {/* Selector de pestañas */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'proximas' ? 'active' : ''}`}
            onClick={() => setActiveTab('proximas')}
          >
            Próximas
          </button>
          <button
            className={`tab-button ${activeTab === 'pasadas' ? 'active' : ''}`}
            onClick={() => setActiveTab('pasadas')}
          >
            Pasadas
          </button>
        </div>

        {/* Lista de citas */}
        <div className="citas-list">
          {citas.map((cita) => (
            <div key={cita.id} className="cita-card">
              <div className="cita-header">
                <span className="cita-especialidad">{cita.especialidad}</span>
                <span className={`status-badge ${
                  cita.estado === 'Confirmada' ? 'status-confirmed' : 'status-pending'
                }`}>
                  {cita.estado}
                </span>
              </div>
              <div className="cita-details">
                <div className="cita-column-left">
                  <div className="cita-detail-item">
                    <span className="cita-detail-label">idCita</span>
                    <span className="cita-detail-value">{cita.id}</span>
                  </div>
                  <div className="cita-detail-item">
                    <span className="cita-detail-label">Hora</span>
                    <span className="cita-detail-value">{cita.hora}</span>
                  </div>
                </div>
                <div className="cita-column-right">
                  <div className="cita-detail-item">
                    <span className="cita-detail-label">Fecha</span>
                    <span className="cita-detail-value">{cita.fecha}</span>
                  </div>
                  <div className="cita-detail-item">
                    <span className="cita-detail-label">Personal de Salud</span>
                    <span className="cita-detail-value">{cita.profesional}</span>
                  </div>
                </div>
              </div>
              <button className="cita-view-button">
                Ver Detalle
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Botón inferior */}
        <div className="bottom-action">
          <button className="btn-primary" onClick={() => navigate('/agendar-cita')}>
            Agendar Nueva Cita
          </button>
        </div>
      </div>
    </div>
  );
}

export default MisCitas;


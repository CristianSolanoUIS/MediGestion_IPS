import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminPortal.css';
import './Checkin.css';

function Checkin() {
  const navigate = useNavigate();
  const [documento, setDocumento] = useState('');

  const handleBuscar = (e) => {
    e.preventDefault();
    // Aquí se manejaría la búsqueda del paciente
    console.log('Buscando paciente con documento:', documento);
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
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div>
              <h1 className="page-title">Check-in Recepción</h1>
              <p className="page-subtitle">Registra la llegada de pacientes</p>
            </div>
          </div>
        </div>

        {/* Card de búsqueda de paciente */}
        <div className="search-patient-card">
          <h2 className="search-card-title">Buscar Paciente</h2>
          <form onSubmit={handleBuscar} className="search-patient-form">
            <div className="form-group">
              <label htmlFor="documento" className="form-label">Número de Documento</label>
              <div className="search-input-row">
                <input
                  type="text"
                  id="documento"
                  className="document-input"
                  placeholder="Ingresa el número de documento"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  required
                />
                <button type="submit" className="btn-search">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 17.5L13.875 13.875" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkin;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminPortal.css';
import './GestionPQRS.css';

function GestionPQRS() {
  const navigate = useNavigate();

  // Mock data
  const pqrsList = [
    {
      id: 'PQRS-1001',
      paciente: 1001,
      tipo: 'Queja',
      estado: 'En revisión',
      fechaRadicado: '2025-11-10',
      sla: '15 días',
      responsable: 'Administrativo 1',
      fechaCompromiso: '2025-11-25'
    },
    {
      id: 'PQRS-1002',
      paciente: 1002,
      tipo: 'Petición',
      estado: 'Resuelta',
      fechaRadicado: '2025-11-05',
      sla: '15 días',
      responsable: 'Administrador de PQRS',
      fechaCompromiso: '2025-11-20'
    },
    {
      id: 'PQRS-1003',
      paciente: 1003,
      tipo: 'Reclamo',
      estado: 'En revisión',
      fechaRadicado: '2025-11-12',
      sla: '10 días',
      responsable: 'Administrativo 2',
      fechaCompromiso: '2025-11-22'
    }
  ];

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
              <h1 className="page-title">Gestión de PQRS</h1>
              <p className="page-subtitle">Administra peticiones, quejas, reclamos y sugerencias</p>
            </div>
          </div>
        </div>

        {/* Tabla de PQRS */}
        <div className="table-card">
          <table className="pqrs-table">
            <thead>
              <tr>
                <th>ID PQRS</th>
                <th>Paciente</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha Radicado</th>
                <th>SLA</th>
                <th>Responsable</th>
                <th>Fecha Compromiso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pqrsList.map((pqrs) => (
                <tr key={pqrs.id}>
                  <td>{pqrs.id}</td>
                  <td>{pqrs.paciente}</td>
                  <td>{pqrs.tipo}</td>
                  <td>
                    <span className={`status-badge ${
                      pqrs.estado === 'Resuelta' ? 'status-resolved' : 'status-review'
                    }`}>
                      {pqrs.estado}
                    </span>
                  </td>
                  <td>{pqrs.fechaRadicado}</td>
                  <td>{pqrs.sla}</td>
                  <td>{pqrs.responsable}</td>
                  <td>{pqrs.fechaCompromiso}</td>
                  <td>
                    <a href="#asignar" className="link-assign">Asignar</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GestionPQRS;


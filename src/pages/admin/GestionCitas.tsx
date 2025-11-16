import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import '../../styles/AdminPortal.css';
import './GestionCitas.css';

interface CitaAdmin {
  id: string;
  paciente: string;
  pacienteId: number;
  profesional: string;
  profesionalId: string;
  fecha: string;
  hora: string;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada' | string;
}

const GestionCitas: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const citas: CitaAdmin[] = [
    {
      id: 'C-1001',
      paciente: 'Paciente 1',
      pacienteId: 1001,
      profesional: 'Profesional 1',
      profesionalId: 'PS-001',
      fecha: '2025-11-22',
      hora: '10:30:00',
      estado: 'Confirmada',
    },
    {
      id: 'C-1002',
      paciente: 'Paciente 2',
      pacienteId: 1002,
      profesional: 'Profesional 2',
      profesionalId: 'PS-002',
      fecha: '2025-11-23',
      hora: '11:00:00',
      estado: 'Pendiente',
    },
    {
      id: 'C-1003',
      paciente: 'Paciente 3',
      pacienteId: 1003,
      profesional: 'Profesional 3',
      profesionalId: 'PS-003',
      fecha: '2025-11-24',
      hora: '14:30:00',
      estado: 'Confirmada',
    },
    {
      id: 'C-1004',
      paciente: 'Paciente 4',
      pacienteId: 1004,
      profesional: 'Profesional 1',
      profesionalId: 'PS-001',
      fecha: '2025-11-25',
      hora: '09:00:00',
      estado: 'Cancelada',
    },
  ];

  const citasFiltradas = citas.filter((cita) => {
    const term = searchTerm.toLowerCase();
    return (
      cita.id.toLowerCase().includes(term) ||
      cita.paciente.toLowerCase().includes(term) ||
      cita.profesional.toLowerCase().includes(term) ||
      cita.pacienteId.toString().includes(term)
    );
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
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
              <h1 className="page-title">Gestión de Citas</h1>
              <p className="page-subtitle">Administra todas las citas del sistema</p>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y botón de creación */}
        <div className="search-bar">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.5 17.5L13.875 13.875" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por ID, paciente, profesional...."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button className="btn-create">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4V12M4 8H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Crear Cita
          </button>
        </div>

        {/* Tabla de citas */}
        <div className="table-card">
          <table className="citas-table">
            <thead>
              <tr>
                <th>ID Cita</th>
                <th>Paciente (ID)</th>
                <th>Personal Salud (ID)</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.map((cita) => (
                <tr key={cita.id}>
                  <td>{cita.id}</td>
                  <td>
                    <div className="cell-two-lines">
                      <div className="cell-line-1">{cita.paciente}</div>
                      <div className="cell-line-2">ID: {cita.pacienteId}</div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-two-lines">
                      <div className="cell-line-1">{cita.profesional}</div>
                      <div className="cell-line-2">{cita.profesionalId}</div>
                    </div>
                  </td>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        cita.estado === 'Confirmada'
                          ? 'status-confirmed'
                          : cita.estado === 'Pendiente'
                          ? 'status-pending'
                          : 'status-cancelled'
                      }`}
                    >
                      {cita.estado}
                    </span>
                  </td>
                  <td>
                    <div className="action-links">
                      <a href="#edit" className="link-edit">
                        Editar
                      </a>
                      <a href="#cancel" className="link-cancel">
                        Cancelar
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestionCitas;



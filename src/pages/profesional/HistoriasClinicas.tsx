import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarProfesional from '../../components/NavbarProfesional';
import '../../styles/ProfesionalPortal.css';
import './HistoriasClinicas.css';

interface HistoriaClinica {
  idPaciente: number;
  nombre: string;
  documento: string;
  edad: number;
  sexo: string;
  diagnosticoPrincipal: string;
  estado: string;
  ultimaAtencion: string;
  medicoTratante: string;
  servicio: string;
  proximaCita: string;
}

const HistoriasClinicas: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  const [ordenPor, setOrdenPor] = useState<string>('Última atención');

  const historias: HistoriaClinica[] = [
    {
      idPaciente: 1001,
      nombre: 'Paciente 1',
      documento: '1.234.567.890',
      edad: 35,
      sexo: 'F',
      diagnosticoPrincipal: 'Hipertensión arterial',
      estado: 'Activa',
      ultimaAtencion: '10/11/2025, 09:30',
      medicoTratante: 'Profesional 1',
      servicio: 'Cardiología',
      proximaCita: '22/11/2025'
    },
    {
      idPaciente: 1002,
      nombre: 'Paciente 2',
      documento: '9.876.543.210',
      edad: 42,
      sexo: 'M',
      diagnosticoPrincipal: 'Diabetes tipo 2',
      estado: 'Activa',
      ultimaAtencion: '08/11/2025, 14:15',
      medicoTratante: 'Profesional 1',
      servicio: 'Cardiología',
      proximaCita: '25/11/2025'
    },
    {
      idPaciente: 1003,
      nombre: 'Paciente 3',
      documento: '5.678.901.234',
      edad: 28,
      sexo: 'M',
      diagnosticoPrincipal: 'Asma bronquial',
      estado: 'Activa',
      ultimaAtencion: '05/11/2025, 11:00',
      medicoTratante: 'Profesional 1',
      servicio: 'Medicina General',
      proximaCita: 'Sin programar'
    }
  ];

  const historiasFiltradas = historias.filter((historia) => {
    const matchSearch = historia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       historia.idPaciente.toString().includes(searchTerm);
    const matchEstado = filtroEstado === 'Todos' || historia.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

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
              <h1 className="page-title">Historias Clínicas</h1>
              <p className="page-subtitle">Consulta y gestiona los registros de tus pacientes</p>
            </div>
          </div>
        </div>

        {/* Barra de filtros / búsqueda */}
        <div className="filters-card">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 17.5L13.875 13.875" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar paciente por nombre o ID"
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters-row">
            <select
              className="filter-select"
              value={filtroEstado}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFiltroEstado(e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Activa">Activos</option>
              <option value="Archivada">Dados de alta</option>
            </select>
            <select
              className="filter-select"
              value={ordenPor}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setOrdenPor(e.target.value)}
            >
              <option value="Última atención">Última atención</option>
              <option value="Nombre A-Z">Nombre A-Z</option>
            </select>
          </div>
        </div>

        {/* Lista de historias clínicas */}
        <div className="historias-list">
          {historiasFiltradas.map((historia) => (
            <div key={historia.idPaciente} className="historia-card">
              <div className="historia-content">
                <div className="historia-column-left">
                  <div className="historia-paciente-name">{historia.nombre}</div>
                  <div className="historia-paciente-details">
                    <span>ID Paciente: {historia.idPaciente}</span>
                    <span>Documento: {historia.documento}</span>
                  </div>
                  <div className="historia-paciente-meta">
                    Edad: {historia.edad} años | Sexo: {historia.sexo}
                  </div>
                  <div className="historia-medica">
                    <div className="historia-diagnostico">
                      Último diagnóstico principal: <span className="diagnostico-text">{historia.diagnosticoPrincipal}</span>
                    </div>
                    <span className={`status-badge ${
                      historia.estado === 'Activa' ? 'status-active' : 'status-archived'
                    }`}>
                      {historia.estado}
                    </span>
                  </div>
                </div>
                <div className="historia-column-right">
                  <div className="historia-atencion-item">
                    <span className="historia-atencion-label">Última Atención:</span>
                    <span className="historia-atencion-value">{historia.ultimaAtencion}</span>
                  </div>
                  <div className="historia-atencion-item">
                    <span className="historia-atencion-label">Médico tratante:</span>
                    <span className="historia-atencion-value bold">{historia.medicoTratante}</span>
                  </div>
                  <div className="historia-atencion-item">
                    <span className="historia-atencion-label">Servicio:</span>
                    <span className="historia-atencion-value">{historia.servicio}</span>
                  </div>
                  <div className="historia-atencion-item">
                    <span className="historia-atencion-label">Próxima cita:</span>
                    <span className="historia-atencion-value">{historia.proximaCita}</span>
                  </div>
                </div>
              </div>
              <div className="historia-actions">
                <button className="btn-secondary-small">Ver Resumen</button>
                <button className="btn-primary-green-small">Ver Historia</button>
              </div>
            </div>
          ))}
        </div>

        {/* Botón inferior */}
        <div className="bottom-action">
          <button className="btn-secondary" onClick={() => navigate('/pro/dashboard')}>
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoriasClinicas;


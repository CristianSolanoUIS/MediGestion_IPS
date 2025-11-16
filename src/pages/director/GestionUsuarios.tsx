import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarDirector from '../../components/NavbarDirector';
import '../../styles/DirectorPortal.css';
import './GestionUsuarios.css';

interface Usuario {
  idUsuario: number | string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  estado: string;
  rol: string;
}

const GestionUsuarios: React.FC = () => {
  const navigate = useNavigate();

  const usuarios: Usuario[] = [
    {
      idUsuario: 1001,
      nombre: 'Paciente 1',
      email: 'paciente1@email.com',
      telefono: '300-000-0001',
      direccion: 'Dirección 1',
      estado: 'Activo',
      rol: 'Paciente',
    },
    {
      idUsuario: 'PS-201',
      nombre: 'Profesional 1',
      email: 'profesional1@medic.com',
      telefono: '300-000-0201',
      direccion: 'Dirección 2',
      estado: 'Activo',
      rol: 'PersonalSalud',
    },
    {
      idUsuario: 2001,
      nombre: 'Usuario Administrativo',
      email: 'admin@medic.com',
      telefono: '300-000-2001',
      direccion: 'Dirección 3',
      estado: 'Activo',
      rol: 'Administrativo',
    },
    {
      idUsuario: 3000,
      nombre: 'Director General',
      email: 'director@medic.com',
      telefono: '300-000-3000',
      direccion: 'Dirección 4',
      estado: 'Activo',
      rol: 'Director',
    },
  ];

  const totalUsuarios = usuarios.length;

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
              <h1 className="page-title">Gestión de Usuarios y Roles</h1>
              <p className="page-subtitle">Administra los usuarios del sistema</p>
            </div>
          </div>
        </div>

        {/* Información superior y botón */}
        <div className="table-header">
          <span className="total-usuarios">Total de usuarios: {totalUsuarios}</span>
          <button className="btn-create-usuario">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4V12M4 8H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Crear Usuario
          </button>
        </div>

        {/* Tabla de usuarios */}
        <div className="table-card">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID Usuario</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.idUsuario}>
                  <td>{usuario.idUsuario}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.direccion}</td>
                  <td>
                    <span className="status-badge status-active">{usuario.estado}</span>
                  </td>
                  <td>
                    <span className="role-badge">{usuario.rol}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <svg
                        className="edit-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 3H3C2.44772 3 2 3.44772 2 4V15C2 15.5523 2.44772 16 3 16H14C14.5523 16 15 15.5523 15 15V9"
                          stroke="#666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.5 1.5L16.5 4.5M11.5 3.5L14.5 6.5"
                          stroke="#666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <a href="#asignar" className="link-asignar">
                        Asignar Rol
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card informativa de modelo de datos */}
        <div className="info-card">
          <p className="info-text">
            <strong>Campos de USUARIOS:</strong> idUsuario, nombre, email, contraseña, telefono, direccion, estado
          </p>
          <p className="info-text">
            <strong>Tabla ROLES:</strong> idRol, nombreRol
          </p>
          <p className="info-text">
            <strong>Tabla USUARIOROL:</strong> idUsuario, idRol (relación muchos a muchos)
          </p>
        </div>
      </div>
    </div>
  );
};

export default GestionUsuarios;



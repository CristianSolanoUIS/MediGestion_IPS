import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PatientPortal.css';
import './Notificaciones.css';

interface Notificacion {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  fechaCreacion: string;
  metadata: string;
  estado: string;
  icono: 'calendar' | 'check' | 'info';
}

const Notificaciones: React.FC = () => {
  const navigate = useNavigate();

  const notificaciones: Notificacion[] = [
    {
      id: 'N-1001',
      tipo: 'Recordatorio',
      titulo: 'Cita próxima - 22/Nov/2025',
      mensaje: 'Tienes una cita médica programada para el día 22 de noviembre de 2025 a las 10:30 AM con Profesional 1 en Cardiología.',
      fechaCreacion: '2025-11-15 09:00:00',
      metadata: '{"idCita":"C-10234"}',
      estado: 'No leída',
      icono: 'calendar'
    },
    {
      id: 'N-1002',
      tipo: 'Confirmación',
      titulo: 'Cita confirmada',
      mensaje: 'Tu cita médica para el 22 de noviembre ha sido confirmada. Por favor, asiste puntualmente.',
      fechaCreacion: '2025-11-14 14:30:00',
      metadata: '{"idCita":"C-10234"}',
      estado: 'Leída',
      icono: 'check'
    },
    {
      id: 'N-1003',
      tipo: 'Informativo',
      titulo: 'Actualización de datos',
      mensaje: 'Por favor, revisa y actualiza tu información de contacto si ha cambiado recientemente.',
      fechaCreacion: '2025-11-10 10:15:00',
      metadata: '{}',
      estado: 'Leída',
      icono: 'info'
    }
  ];

  const getIcono = (tipoIcono: 'calendar' | 'check' | 'info'): JSX.Element | null => {
    switch (tipoIcono) {
      case 'calendar':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4V8M16 4V8M4 10H20M4 6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6Z" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'check':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'info':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

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
              <h1 className="page-title">Notificaciones</h1>
              <p className="page-subtitle">Revisa tus mensajes y alertas</p>
            </div>
          </div>
        </div>

        {/* Lista de notificaciones */}
        <div className="notificaciones-list">
          {notificaciones.map((notif) => (
            <div key={notif.id} className="notificacion-card">
              <div className="notificacion-header">
                <div className="notificacion-icon">
                  {getIcono(notif.icono)}
                </div>
                <span className={`status-badge ${
                  notif.estado === 'No leída' ? 'status-unread' : 'status-read'
                }`}>
                  {notif.estado}
                </span>
              </div>
              <h3 className="notificacion-titulo">{notif.titulo}</h3>
              <div className="notificacion-id">ID: {notif.id}</div>
              <p className="notificacion-mensaje">{notif.mensaje}</p>
              <div className="notificacion-metadata">
                <div className="metadata-column">
                  <span className="metadata-label">Tipo</span>
                  <span className="metadata-value">{notif.tipo}</span>
                </div>
                <div className="metadata-column">
                  <span className="metadata-label">Creada en</span>
                  <span className="metadata-value">{notif.fechaCreacion}</span>
                </div>
              </div>
              <div className="notificacion-json">
                <span className="metadata-label">Metadata</span>
                <code className="json-value">{notif.metadata}</code>
              </div>
            </div>
          ))}
        </div>

        {/* Botón inferior */}
        <div className="bottom-action">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notificaciones;


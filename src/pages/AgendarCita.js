import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PatientPortal.css';
import './AgendarCita.css';

function AgendarCita() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    especialidad: '',
    sede: '',
    personal: '',
    fecha: '',
    hora: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se manejaría el envío de la solicitud
    console.log('Formulario enviado:', formData);
    navigate('/mis-citas');
  };

  return (
    <div className="patient-portal">
      <Navbar />
      <div className="portal-content">
        {/* Encabezado */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/mis-citas')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div>
              <h1 className="page-title">Agendar Nueva Cita</h1>
              <p className="page-subtitle">Solicita tu cita médica</p>
            </div>
          </div>
        </div>

        {/* Card de formulario */}
        <div className="form-card">
          <h2 className="form-card-title">Información de la Cita</h2>
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label htmlFor="especialidad" className="form-label">Especialidad</label>
              <select
                id="especialidad"
                name="especialidad"
                className="form-input"
                value={formData.especialidad}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione especialidad</option>
                <option value="cardiologia">Cardiología</option>
                <option value="medicina-general">Medicina General</option>
                <option value="dermatologia">Dermatología</option>
                <option value="pediatria">Pediatría</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sede" className="form-label">Sede</label>
              <select
                id="sede"
                name="sede"
                className="form-input"
                value={formData.sede}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione sede</option>
                <option value="centro-norte">Centro Norte</option>
                <option value="centro-sur">Centro Sur</option>
                <option value="sede-principal">Sede Principal</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="personal" className="form-label">Personal de Salud (ID)</label>
              <select
                id="personal"
                name="personal"
                className="form-input"
                value={formData.personal}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione profesional</option>
                <option value="profesional-1">Profesional 1</option>
                <option value="profesional-2">Profesional 2</option>
                <option value="profesional-3">Profesional 3</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha" className="form-label">Fecha</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  className="form-input"
                  value={formData.fecha}
                  onChange={handleChange}
                  placeholder="dd/mm/aaaa"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="hora" className="form-label">Hora</label>
                <input
                  type="time"
                  id="hora"
                  name="hora"
                  className="form-input"
                  value={formData.hora}
                  onChange={handleChange}
                  placeholder="--:-- --"
                  required
                />
              </div>
            </div>

            {/* Nota informativa */}
            <div className="info-box">
              <p className="info-text">
                <strong>Nota:</strong> La cita quedará en estado "Pendiente" hasta que sea confirmada por el área administrativa.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/mis-citas')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Enviar Solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgendarCita;


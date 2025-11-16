import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PatientPortal.css';
import './PQRS.css';

interface PQRSFormData {
  tipo: string;
  cita: string;
  descripcion: string;
}

const PQRS: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PQRSFormData>({
    tipo: '',
    cita: '',
    descripcion: ''
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Aquí se manejaría el envío del PQRS
    console.log('PQRS enviado:', formData);
    navigate('/dashboard');
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
              <h1 className="page-title">Radicar PQRS</h1>
              <p className="page-subtitle">Peticiones, Quejas, Reclamos y Sugerencias</p>
            </div>
          </div>
        </div>

        {/* Card de formulario */}
        <div className="form-card">
          <h2 className="form-card-title">Formulario PQRS</h2>
          <form onSubmit={handleSubmit} className="pqrs-form">
            <div className="form-group">
              <label htmlFor="tipo" className="form-label">Tipo de PQRS</label>
              <select
                id="tipo"
                name="tipo"
                className="form-input"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione el tipo</option>
                <option value="peticion">Petición</option>
                <option value="queja">Queja</option>
                <option value="reclamo">Reclamo</option>
                <option value="sugerencia">Sugerencia</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cita" className="form-label">Relacionada con Cita (Opcional)</label>
              <select
                id="cita"
                name="cita"
                className="form-input"
                value={formData.cita}
                onChange={handleChange}
              >
                <option value="">Seleccione una cita (opcional)</option>
                <option value="C-10234">C-10234 - 2025-11-22 - Profesional 1</option>
                <option value="C-10235">C-10235 - 2025-11-25 - Profesional 2</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="form-textarea"
                rows={6}
                placeholder="Describe tu petición, queja, reclamo o sugerencia..."
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </div>

            {/* Bloque informativo */}
            <div className="info-box">
              <div className="info-box-header">
                <div className="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <strong className="info-title">Campos automáticos del sistema:</strong>
              </div>
              <ul className="info-list">
                <li><code>idPaciente</code>: Se asignará automáticamente</li>
                <li><code>estado</code>: Iniciará como "En revisión"</li>
                <li><code>fechaRadicado</code>: Fecha y hora actual</li>
                <li><code>SLA</code>: Se calculará según tipo de PQRS</li>
                <li><code>responsable</code>: Se asignará al área correspondiente</li>
                <li><code>fechaCompromiso</code>: Se calculará según SLA</li>
              </ul>
            </div>

            {/* Resumen de datos automáticos */}
            <div className="auto-data-summary">
              <div className="summary-column">
                <div className="summary-item">
                  <span className="summary-label">ID Paciente</span>
                  <span className="summary-value">1001 (automático)</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Fecha Radicado</span>
                  <span className="summary-value">15/11/2025, 17:17:07</span>
                </div>
              </div>
              <div className="summary-column">
                <div className="summary-item">
                  <span className="summary-label">Estado</span>
                  <span className="summary-value">En revisión (automático)</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">SLA (días hábiles)</span>
                  <span className="summary-value">15 días (según normativa)</span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Enviar PQRS
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PQRS;


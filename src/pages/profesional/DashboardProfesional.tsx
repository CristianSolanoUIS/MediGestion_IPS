import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarProfesional from '../../components/NavbarProfesional';
import '../../styles/ProfesionalPortal.css';
import './DashboardProfesional.css';
import { fetchProfile } from '../../services/authService';
import { listarAgendas, type AgendaResponse } from '../../services/agendaService';

// Ya no se gestionan citas aquí; solo métricas de agenda y accesos rápidos.

const DashboardProfesional: React.FC = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>('Profesional');
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [agendas, setAgendas] = useState<AgendaResponse[]>([]);
  const [agendasLoading, setAgendasLoading] = useState<boolean>(false);
  const [agendasError, setAgendasError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const load = async (): Promise<void> => {
      try {
        const profile = await fetchProfile(controller.signal);
        if (!mounted) return;
        setDisplayName(profile.user.nombre ?? 'Profesional');
        setProfessionalId(profile.user.id);
        setAgendasLoading(true);
        const agendasData = await listarAgendas({ profesionalId: profile.user.id }, controller.signal);
        if (!mounted) return;
        setAgendas(agendasData);
      } catch (error) {
        if (!mounted) return;
        setAgendasError(error instanceof Error ? error.message : 'No fue posible cargar tus agendas');
      } finally {
        if (mounted) {
          setAgendasLoading(false);
        }
      }
    };
    void load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // Se elimina la lógica de citas: no se cargan ni se actualizan estados.

  const metricAgendas = agendas.length;
  const metricCupos = useMemo(() => agendas.reduce((acc, agenda) => acc + (agenda.cupos ?? 0), 0), [agendas]);
  // Se elimina métrica de cupos disponibles.

  return (
    <div className="profesional-portal">
      <NavbarProfesional />
      <div className="portal-content">
        <div className="welcome-header">
          <h1 className="welcome-title">Hola, {displayName}</h1>
          <p className="welcome-subtitle">Gestiona tu agenda y recursos disponibles</p>
        </div>

        {/* Métricas de agenda */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value metric-blue">{metricAgendas}</div>
            <div className="metric-label">Agendas activas</div>
          </div>
          <div className="metric-card">
            <div className="metric-value metric-green">{metricCupos}</div>
            <div className="metric-label">Cupos publicados</div>
          </div>
        </div>

        {agendasError && <div className="info-banner error">{agendasError}</div>}
        {agendasLoading && <div className="info-banner muted">Cargando tus agendas...</div>}

        {/* Sección de acciones principales */}
        <div className="actions-grid">
          <div className="action-card">
            <div className="action-card-header">
              <svg className="action-icon icon-blue" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V6C28 4.89543 27.1046 4 26 4H6Z" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4V8M10 4V8M4 12H28" stroke="#1A67FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="action-card-title">Mi Agenda</h3>
            <p className="action-card-subtitle">Consulta tu agenda y disponibilidad</p>
            <button className="btn-primary-blue" onClick={() => navigate('/pro/agenda')}>
              Ver Agenda
            </button>
          </div>
          <div className="action-card">
            <div className="action-card-header">
              <svg className="action-icon icon-green" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6C6.89543 6 6 6.89543 6 8V24C6 25.1046 6.89543 26 8 26H24C25.1046 26 26 25.1046 26 24V8C26 6.89543 25.1046 6 24 6H8Z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 12H22M10 16H22M10 20H18" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="action-card-title">Historias Clínicas</h3>
            <p className="action-card-subtitle">Accede a los registros de tus pacientes</p>
            <button className="btn-primary-green" onClick={() => navigate('/pro/historias')}>
              Ver Historias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfesional;


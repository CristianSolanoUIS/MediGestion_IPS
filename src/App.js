import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './pages/Dashboard';
import MisCitas from './pages/MisCitas';
import AgendarCita from './pages/AgendarCita';
import Notificaciones from './pages/Notificaciones';
import PQRS from './pages/PQRS';
import DashboardProfesional from './pages/profesional/DashboardProfesional';
import AgendaProfesional from './pages/profesional/AgendaProfesional';
import HistoriasClinicas from './pages/profesional/HistoriasClinicas';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionCitas from './pages/admin/GestionCitas';
import AgendaProfesionalAdmin from './pages/admin/AgendaProfesional';
import Checkin from './pages/admin/Checkin';
import GestionPQRS from './pages/admin/GestionPQRS';
import DashboardDirector from './pages/director/DashboardDirector';
import GestionUsuarios from './pages/director/GestionUsuarios';
import Reportes from './pages/director/Reportes';
import ReprogramacionMasiva from './pages/director/ReprogramacionMasiva';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Rutas del Portal del Paciente */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mis-citas" element={<MisCitas />} />
        <Route path="/agendar-cita" element={<AgendarCita />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/pqrs" element={<PQRS />} />
        {/* Rutas del Panel Profesional */}
        <Route path="/pro/dashboard" element={<DashboardProfesional />} />
        <Route path="/pro/agenda" element={<AgendaProfesional />} />
        <Route path="/pro/historias" element={<HistoriasClinicas />} />
        {/* Rutas del Panel Administrativo */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/citas" element={<GestionCitas />} />
        <Route path="/admin/agenda-profesional" element={<AgendaProfesionalAdmin />} />
        <Route path="/admin/checkin" element={<Checkin />} />
        <Route path="/admin/pqrs" element={<GestionPQRS />} />
        {/* Rutas del Panel del Director */}
        <Route path="/director/dashboard" element={<DashboardDirector />} />
        <Route path="/director/usuarios" element={<GestionUsuarios />} />
        <Route path="/director/reportes" element={<Reportes />} />
        <Route path="/director/reprogramacion" element={<ReprogramacionMasiva />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

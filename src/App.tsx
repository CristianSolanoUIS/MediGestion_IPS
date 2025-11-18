import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import RoleSelection from './pages/RoleSelection';
import Dashboard from './pages/paciente/Dashboard';
import MisCitas from './pages/paciente/MisCitas';
import Notificaciones from './pages/paciente/Notificaciones';
import PQRS from './pages/paciente/PQRS';
import DashboardProfesional from './pages/profesional/DashboardProfesional';
import AgendaProfesional from './pages/profesional/AgendaProfesional';
import HistoriasClinicas from './pages/profesional/HistoriasClinicas';
import GestionCitasProfesional from './pages/profesional/GestionCitas';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionCitas from './pages/admin/GestionCitas';
import AgendaProfesionalAdmin from './pages/admin/AgendaProfesional';
import Checkin from './pages/admin/Checkin';
import GestionPQRS from './pages/admin/GestionPQRS';
import DashboardDirector from './pages/director/DashboardDirector';
import GestionUsuarios from './pages/director/GestionUsuarios';
import Reportes from './pages/director/Reportes';
import BitacoraDirector from './pages/director/BitacoraDirector';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/seleccionar-rol" element={<RoleSelection />} />
        {/* Rutas del Portal del Paciente */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mis-citas" element={<MisCitas />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/pqrs" element={<PQRS />} />
        {/* Rutas del Panel Profesional */}
        <Route path="/pro/dashboard" element={<DashboardProfesional />} />
        <Route path="/pro/agenda" element={<AgendaProfesional />} />
        <Route path="/pro/historias" element={<HistoriasClinicas />} />
        <Route path="/pro/citas" element={<GestionCitasProfesional />} />
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
        <Route path="/director/bitacora" element={<BitacoraDirector />} />
        {/** Se removió la ruta de Reprogramación Masiva */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;


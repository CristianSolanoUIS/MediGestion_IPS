import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarProfesional.css';

const NavbarProfesional: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar-profesional">
      <div className="navbar-left">
        <div className="navbar-logo">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="professionalPortalGradient" x1="12" y1="10" x2="36" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#15803D" />
                <stop offset="1" stopColor="#22C55E" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="36" height="36" rx="11" fill="url(#professionalPortalGradient)" />
            <path
              d="M18 14V23C18 26.3137 20.6863 29 24 29C27.3137 29 30 26.3137 30 23V14"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="18" cy="12" r="2" fill="white" />
            <circle cx="30" cy="12" r="2" fill="white" />
            <path
              d="M18 26V28C18 31.3137 20.6863 34 24 34C27.3137 34 30 31.3137 30 28V26"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="34" r="4" stroke="white" strokeWidth="1.8" fill="none" />
            <path d="M24 38V40" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M22 34H26" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M14 18H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 16V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="navbar-brand">
          <div className="navbar-brand-title">MediGestión IPS</div>
          <div className="navbar-brand-subtitle">Panel Profesional</div>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-profile">
          <div className="profile-info">
            <div className="profile-name">Profesional 1</div>
            <div className="profile-id">ID: PS-201 | Especialidad: Especialidad</div>
          </div>
        </div>
        <div className="navbar-logout" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5M7.5 2.5H5.83333C4.91286 2.5 4.16667 3.24619 4.16667 4.16667V15.8333C4.16667 16.7538 4.91286 17.5 5.83333 17.5H7.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default NavbarProfesional;


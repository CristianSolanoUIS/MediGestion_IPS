import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarProfesional.css';

const NavbarProfesional: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar-profesional">
      <div className="navbar-left">
        <div className="navbar-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#16A34A"/>
            <path d="M20 12C17.8 12 16 13.8 16 16C16 18.2 17.8 20 20 20C22.2 20 24 18.2 24 16C24 13.8 22.2 12 20 12ZM20 22C17.2 22 14 23.2 14 26V28H26V26C26 23.2 22.8 22 20 22Z" fill="white"/>
            <path d="M16 14H18V16H16V14Z" fill="white"/>
            <path d="M22 14H24V16H22V14Z" fill="white"/>
            <path d="M18 20H22V22H18V20Z" fill="white"/>
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


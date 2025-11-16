import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarAdmin.css';

const NavbarAdmin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar-admin">
      <div className="navbar-left">
        <div className="navbar-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#F97316"/>
            <path d="M20 12C18.8954 12 18 12.8954 18 14V16C18 17.1046 18.8954 18 20 18C21.1046 18 22 17.1046 22 16V14C22 12.8954 21.1046 12 20 12Z" fill="white"/>
            <path d="M20 20C18.3431 20 17 21.3431 17 23V25C17 26.6569 18.3431 28 20 28C21.6569 28 23 26.6569 23 25V23C23 21.3431 21.6569 20 20 20Z" fill="white"/>
            <circle cx="20" cy="15" r="2" fill="white"/>
            <circle cx="20" cy="24" r="2" fill="white"/>
            <path d="M12 20L14 22L16 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24 20L26 22L28 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="navbar-brand">
          <div className="navbar-brand-title">MediGestión IPS</div>
          <div className="navbar-brand-subtitle">Panel Administrativo</div>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-profile">
          <div className="profile-info">
            <div className="profile-name">Usuario Administrativo</div>
            <div className="profile-id">ID Usuario: 0001 | Área: Administración</div>
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

export default NavbarAdmin;


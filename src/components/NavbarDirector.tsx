import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarDirector.css';

const NavbarDirector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar-director">
      <div className="navbar-left">
        <div className="navbar-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#8B5CF6"/>
            <path d="M20 8L12 12V20C12 26.6274 17.3726 32 24 32C30.6274 32 36 26.6274 36 20V12L28 8M20 8L28 8M20 8V32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 20H20M28 20H36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="navbar-brand">
          <div className="navbar-brand-title">MediGestión IPS</div>
          <div className="navbar-brand-subtitle">Panel Director</div>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-profile">
          <div className="profile-info">
            <div className="profile-name">Director General</div>
            <div className="profile-id">ID: 3000 | Cargo: Director General</div>
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

export default NavbarDirector;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarAdmin.css';

const NavbarAdmin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar-admin">
      <div className="navbar-left">
        <div className="navbar-logo">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="adminPortalGradient" x1="12" y1="10" x2="38" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F97316" />
                <stop offset="1" stopColor="#FB923C" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="36" height="36" rx="11" fill="url(#adminPortalGradient)" />
            <rect
              x="16"
              y="14"
              width="16"
              height="22"
              rx="3.5"
              stroke="white"
              strokeWidth="1.8"
              fill="white"
              fillOpacity="0.08"
            />
            <path d="M20.5 12H27.5C28.6046 12 29.5 12.8954 29.5 14V16.5H18.5V14C18.5 12.8954 19.3954 12 20.5 12Z" fill="white" fillOpacity="0.9" />
            <rect x="21.5" y="10" width="5" height="4" rx="2" fill="white" />
            <path d="M20 20H28" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
            <path d="M20 24H26" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
            <path d="M20 28H25" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
            <path d="M18.5 23L20 24.5L22.5 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="31.5" cy="29.5" r="4.7" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M31.5 24.8V26.3" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M31.5 32.7V34.2" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M27.8 29.5H26.3" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M36.7 29.5H35.2" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M28.5 26.2L27.4 25.1" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M35.6 33.4L34.5 32.3" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M34.5 26.7L33.4 27.8" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M29.6 32.8L28.5 33.9" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
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


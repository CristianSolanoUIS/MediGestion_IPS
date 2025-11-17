import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarDirector.css';

const NavbarDirector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar-director">
      <div className="navbar-left">
        <div className="navbar-logo">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="directorPortalGradient" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7C3AED" />
                <stop offset="1" stopColor="#C084FC" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="36" height="36" rx="12" fill="url(#directorPortalGradient)" />
            <path
              d="M18 14H30C31.1046 14 32 14.8954 32 16V26C32 30.6421 28.0019 34.9068 24 36C19.9981 34.9068 16 30.6421 16 26V16C16 14.8954 16.8954 14 18 14Z"
              fill="white"
              fillOpacity="0.08"
              stroke="white"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M19 18L22.5 20.5L24 17L25.5 20.5L29 18"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 28L22.5 24L26.5 27L32 20"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M32 20H34.5C35.8807 20 37 21.1193 37 22.5V24" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="33.5" cy="16.5" r="3" stroke="white" strokeWidth="1.5" />
            <path d="M22 31H26" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
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


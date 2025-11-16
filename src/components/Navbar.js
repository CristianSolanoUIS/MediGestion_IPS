import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const notificationCount = 2; // Mock data

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#1A67FD"/>
            <path d="M20 12C17.8 12 16 13.8 16 16C16 18.2 17.8 20 20 20C22.2 20 24 18.2 24 16C24 13.8 22.2 12 20 12ZM20 22C17.2 22 14 23.2 14 26V28H26V26C26 23.2 22.8 22 20 22Z" fill="white"/>
            <path d="M16 14H18V16H16V14Z" fill="white"/>
            <path d="M22 14H24V16H22V14Z" fill="white"/>
          </svg>
        </div>
        <div className="navbar-brand">
          <div className="navbar-brand-title">MediGestión IPS</div>
          <div className="navbar-brand-subtitle">Portal del Paciente</div>
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-notification" onClick={() => navigate('/notificaciones')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {notificationCount > 0 && (
            <span className="notification-dot"></span>
          )}
        </div>
        <div className="navbar-profile">
          <div className="profile-info">
            <div className="profile-name">Paciente</div>
            <div className="profile-id">ID Usuario: 100</div>
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
}

export default Navbar;


import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logoImg from './logo_MediGestion.png';
import { fetchProfile, login, AuthRole } from './services/authService';
import { isHttpError } from './services/httpClient';
import { setAccessToken, setRoles, setUser } from './services/authStorage';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pendingRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      pendingRequest.current?.abort();
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      pendingRequest.current?.abort();
      const controller = new AbortController();
      pendingRequest.current = controller;

      setIsSubmitting(true);
      const authData = await login({ email, password }, controller.signal);

      setAccessToken(authData.access_token);
      setUser(authData.user);

      let effectiveRoles: AuthRole[] = authData.roles ?? [];

      try {
        const profile = await fetchProfile(controller.signal);
        if (profile.user) {
          setUser(profile.user);
        }
        if (Array.isArray(profile.roles) && profile.roles.length > 0) {
          effectiveRoles = profile.roles;
        }
      } catch {
        // Ignoramos la falla de perfil porque los roles iniciales ya permiten continuar.
      }

      setRoles(effectiveRoles);

      navigate('/seleccionar-rol');
    } catch (error) {
      if (isHttpError(error)) {
        if (error.status === 401 || error.status === 403) {
          setErrorMessage('Credenciales inválidas. Verifica tu email y contraseña.');
        } else if (error.status === 0) {
          setErrorMessage('No pudimos contactar al servidor. Asegúrate de que el backend está en ejecución y permite solicitudes CORS.');
        } else {
          setErrorMessage(error.message);
        }
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Ocurrió un error inesperado. Intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Icono superior */}
        <div className="login-icon">
          <img src={logoImg} alt="MediGestión IPS" className="login-logo-img" />
        </div>

        {/* Título y subtítulo */}
        <div className="login-header">
          <h1 className="login-title">MediGestión IPS</h1>
          <p className="login-subtitle">Sistema de Gestión Médica</p>
        </div>

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 5.83333L9.0755 11.0504C9.63533 11.4236 10.3647 11.4236 10.9245 11.0504L17.5 5.83333M4.16667 15.8333H15.8333C16.7538 15.8333 17.5 15.0871 17.5 14.1667V5.83333C17.5 4.91286 16.7538 4.16667 15.8333 4.16667H4.16667C3.24619 4.16667 2.5 4.91286 2.5 5.83333V14.1667C2.5 15.0871 3.24619 15.8333 4.16667 15.8333Z" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.83333 9.16667V5.83333C5.83333 4.72826 6.27232 3.66846 7.05372 2.88706C7.83512 2.10565 8.89493 1.66667 9.99999 1.66667C11.1051 1.66667 12.1649 2.10565 12.9463 2.88706C13.7277 3.66846 14.1667 4.72826 14.1667 5.83333V9.16667" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Botón de inicio de sesión */}
          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando…' : 'Iniciar Sesión'}
          </button>

          {errorMessage && (
            <div className="form-error" role="alert" aria-live="assertive">
              {errorMessage}
            </div>
          )}
        </form>

        {/* Enlace de contraseña olvidada */}
        <a href="#forgot" className="forgot-password-link">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  );
};

export default Login;


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GestionCitas = (): null => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/pro/dashboard', { replace: true });
  }, [navigate]);

  return null;
};

export default GestionCitas;

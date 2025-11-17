import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza el título principal del login', () => {
  render(<App />);
  expect(screen.getByText(/MediGestión IPS/i)).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import { sembrarSesion } from '../testUtils';

function renderProtegida() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/privada']}>
        <Routes>
          <Route path="/" element={<p>Inicio público</p>} />
          <Route
            path="/privada"
            element={
              <ProtectedRoute>
                <p>Zona privada</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirige al inicio cuando no hay sesión', () => {
    renderProtegida();

    expect(screen.getByText('Inicio público')).toBeInTheDocument();
  });

  it('redirige al inicio a un cliente', () => {
    sembrarSesion({ nombre: 'Ana', tipo: 'Cliente' });
    renderProtegida();

    expect(screen.getByText('Inicio público')).toBeInTheDocument();
  });

  it('permite el paso a un administrador', () => {
    sembrarSesion({ nombre: 'Admin', tipo: 'Administrador' });
    renderProtegida();

    expect(screen.getByText('Zona privada')).toBeInTheDocument();
  });

  it('permite el paso a un vendedor', () => {
    sembrarSesion({ nombre: 'Vendedor', tipo: 'Vendedor' });
    renderProtegida();

    expect(screen.getByText('Zona privada')).toBeInTheDocument();
  });
});
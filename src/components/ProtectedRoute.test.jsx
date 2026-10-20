import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';

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
    localStorage.setItem('usuarioActivo', JSON.stringify({ nombre: 'Ana', tipo: 'Cliente' }));
    renderProtegida();

    expect(screen.getByText('Inicio público')).toBeInTheDocument();
  });

  it('permite el paso a un administrador', () => {
    localStorage.setItem(
      'usuarioActivo',
      JSON.stringify({ nombre: 'Admin', tipo: 'Administrador' })
    );
    renderProtegida();

    expect(screen.getByText('Zona privada')).toBeInTheDocument();
  });

  it('permite el paso a un vendedor', () => {
    localStorage.setItem(
      'usuarioActivo',
      JSON.stringify({ nombre: 'Vendedor', tipo: 'Vendedor' })
    );
    renderProtegida();

    expect(screen.getByText('Zona privada')).toBeInTheDocument();
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';

function renderApp(ruta) {
  window.history.pushState({}, '', ruta);
  return render(
    <AuthProvider>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </AuthProvider>
  );
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra el Home en la ruta raíz', () => {
    renderApp('/');

    expect(screen.getByRole('heading', { name: 'Nuevos lanzamientos' })).toBeInTheDocument();
  });

  it('muestra la página que corresponde a la dirección', () => {
    renderApp('/nosotros');

    expect(screen.getByRole('heading', { name: 'Sobre Nosotros' })).toBeInTheDocument();
  });

  it('cambia de página al usar un enlace del menú', () => {
    renderApp('/');

    fireEvent.click(screen.getByRole('link', { name: 'Blog' }));

    expect(screen.getByRole('heading', { name: 'Blog TechStore' })).toBeInTheDocument();
  });

    it('muestra la página 404 cuando la dirección no existe', () => {
    renderApp('/ruta-que-no-existe');

    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument();
  });
});
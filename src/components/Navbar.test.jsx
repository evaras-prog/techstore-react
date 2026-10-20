import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { AuthProvider } from '../context/AuthContext';
import { CarritoProvider } from '../context/CarritoContext';

function renderNavbar() {
  return render(
    <AuthProvider>
      <CarritoProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

function iniciarSesion(usuario) {
  localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('sin sesión ofrece ingresar y registrarse', () => {
    renderNavbar();

    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Registrarse' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Salir' })).not.toBeInTheDocument();
  });

  it('con sesión de cliente muestra el nombre y el botón Salir, sin enlace Admin', () => {
    iniciarSesion({ nombre: 'Ana', tipo: 'Cliente' });
    renderNavbar();

    expect(screen.getByText('Hola, Ana')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salir' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('con sesión de administrador muestra el enlace Admin', () => {
    iniciarSesion({ nombre: 'Admin', tipo: 'Administrador' });
    renderNavbar();

    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
  });

  it('muestra en el carrito la suma de las cantidades', () => {
    localStorage.setItem(
      'carrito',
      JSON.stringify([
        { codigo: 'A', precio: 100, cantidad: 2 },
        { codigo: 'B', precio: 100, cantidad: 1 },
      ])
    );
    renderNavbar();

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('cierra la sesión al presionar Salir', () => {
    iniciarSesion({ nombre: 'Ana', tipo: 'Cliente' });
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: 'Salir' }));

    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument();
    expect(localStorage.getItem('usuarioActivo')).toBeNull();
  });
});
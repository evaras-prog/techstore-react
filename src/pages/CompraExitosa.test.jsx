import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CompraExitosa from './CompraExitosa';

const pedido = {
  id: 'PED-123',
  fecha: '2026-10-18',
  cliente: 'Ana Pérez',
  correo: 'ana@correo.cl',
  total: 200000,
  entrega: 'retiro',
  direccion: '',
  region: '',
  comuna: '',
  items: [
    { codigo: 'TEC001', nombre: 'Laptop Ultrabook Pro', cantidad: 2, precioUnitario: 100000 },
  ],
};

describe('CompraExitosa', () => {
  it('muestra el resumen del pedido recibido', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/compra-exitosa', state: { pedido } }]}>
        <CompraExitosa />
      </MemoryRouter>
    );

    expect(screen.getByText(/¡Compra exitosa!/)).toBeInTheDocument();
    expect(screen.getByText('PED-123')).toBeInTheDocument();
    expect(screen.getByText('Laptop Ultrabook Pro')).toBeInTheDocument();
    expect(screen.getByText('Retiro en tienda')).toBeInTheDocument();
  });

  it('muestra un aviso si se entra sin una compra reciente', () => {
    render(
      <MemoryRouter>
        <CompraExitosa />
      </MemoryRouter>
    );

    expect(
      screen.getByText('No hay una compra reciente para mostrar.')
    ).toBeInTheDocument();
  });
});
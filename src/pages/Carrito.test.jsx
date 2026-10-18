import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Carrito from './Carrito';
import { CarritoProvider } from '../context/CarritoContext';

const producto = {
  codigo: 'TEC001',
  nombre: 'Laptop Ultrabook Pro',
  precio: 100000,
  oferta: false,
  precioOferta: 0,
  imagen: '/img/laptop.jpg',
  cantidad: 1,
};

function renderCarrito() {
  return render(
    <CarritoProvider>
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    </CarritoProvider>
  );
}

describe('Carrito', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra un mensaje y oculta el botón de pago cuando está vacío', () => {
    renderCarrito();

    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /ir a pagar/i })
    ).not.toBeInTheDocument();
  });

  it('muestra los productos con su subtotal y el total', () => {
    localStorage.setItem('carrito', JSON.stringify([{ ...producto, cantidad: 2 }]));
    renderCarrito();

    expect(screen.getByText('Laptop Ultrabook Pro')).toBeInTheDocument();
    expect(screen.getAllByText(/200\.000/)).toHaveLength(2);
  });

  it('actualiza la cantidad y el total al presionar +', () => {
    localStorage.setItem('carrito', JSON.stringify([producto]));
    renderCarrito();

    fireEvent.click(screen.getByRole('button', { name: /aumentar cantidad/i }));

    expect(screen.getAllByText(/200\.000/)).toHaveLength(2);
  });

  it('vacía el carrito al presionar "Vaciar carrito"', () => {
    localStorage.setItem('carrito', JSON.stringify([producto]));
    renderCarrito();

    fireEvent.click(screen.getByRole('button', { name: /vaciar carrito/i }));

    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });
});
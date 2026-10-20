import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Ofertas from './Ofertas';
import { CarritoProvider } from '../context/CarritoContext';
import { PRODUCTOS_BASE } from '../data/datos';

function renderOfertas() {
  return render(
    <CarritoProvider>
      <MemoryRouter>
        <Ofertas />
      </MemoryRouter>
    </CarritoProvider>
  );
}

describe('Ofertas', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra solo los productos en oferta', () => {
    renderOfertas();

    expect(screen.getByText('Audífonos Noise Pro')).toBeInTheDocument();
    expect(screen.getByText('Teclado Mechanical K')).toBeInTheDocument();
    expect(screen.queryByText('Laptop Ultrabook Pro')).not.toBeInTheDocument();
  });

  it('muestra un aviso cuando no hay productos en oferta', () => {
    const sinOfertas = PRODUCTOS_BASE.map((p) => ({ ...p, oferta: false }));
    localStorage.setItem('productosAdmin', JSON.stringify(sinOfertas));

    renderOfertas();

    expect(screen.getByText('Por ahora no hay productos en oferta.')).toBeInTheDocument();
  });
});
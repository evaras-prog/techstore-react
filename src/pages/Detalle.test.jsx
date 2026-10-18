import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Detalle from './Detalle';
import { CarritoProvider } from '../context/CarritoContext';

function renderDetalle(ruta) {
  return render(
    <CarritoProvider>
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/producto/:codigo" element={<Detalle />} />
        </Routes>
      </MemoryRouter>
    </CarritoProvider>
  );
}

describe('Detalle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra los datos del producto indicado en la URL', () => {
    renderDetalle('/producto/TEC001');

    expect(
      screen.getByRole('heading', { name: 'Laptop Ultrabook Pro' })
    ).toBeInTheDocument();
    expect(screen.getByText('Computación')).toBeInTheDocument();
  });

  it('muestra un aviso y oculta el botón si el producto no existe', () => {
    renderDetalle('/producto/XXX');

    expect(screen.getByText('Producto no encontrado.')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /agregar al carrito/i })
    ).not.toBeInTheDocument();
  });

  it('muestra el precio de oferta y el aviso de stock bajo', () => {
    renderDetalle('/producto/TEC003');

    expect(screen.getByText(/99\.990/)).toBeInTheDocument();
    expect(screen.getByText(/Últimas 4 unidades/)).toBeInTheDocument();
  });
});
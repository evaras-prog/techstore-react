import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Categorias from './Categorias';
import { CarritoProvider } from '../context/CarritoContext';

function renderCategorias() {
  return render(
    <CarritoProvider>
      <MemoryRouter>
        <Categorias />
      </MemoryRouter>
    </CarritoProvider>
  );
}

describe('Categorias', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra una sección por cada categoría del catálogo', () => {
    renderCategorias();

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(5);
  });

  it('indica cuántos productos tiene cada categoría', () => {
    renderCategorias();

    const encabezado = screen.getByRole('heading', { level: 2, name: /Accesorios/ });

    expect(within(encabezado).getByText('2')).toBeInTheDocument();
  });
});
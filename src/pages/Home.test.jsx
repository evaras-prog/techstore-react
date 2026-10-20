import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { CarritoProvider } from '../context/CarritoContext';

function renderHome() {
  return render(
    <CarritoProvider>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </CarritoProvider>
  );
}

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra el carrusel y las secciones de la página', () => {
    renderHome();

    expect(
      screen.getByRole('heading', { name: 'Nuevos lanzamientos' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Categorías' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Ofertas destacadas' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Productos destacados' })
    ).toBeInTheDocument();
  });

  it('muestra una tarjeta por cada categoría del catálogo', () => {
    renderHome();

    const seccion = screen.getByRole('region', { name: 'Categorías' });

    expect(within(seccion).getAllByRole('link')).toHaveLength(5);
  });

  it('separa las ofertas de los productos destacados', () => {
    renderHome();

    expect(screen.getAllByRole('button', { name: /agregar al carrito/i })).toHaveLength(5);
    expect(screen.getByText('Teclado Mechanical K')).toBeInTheDocument();
    expect(screen.getByText('Tablet ProPad 11')).toBeInTheDocument();
  });
});
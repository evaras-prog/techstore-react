import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Carrusel from './Carrusel';

const slides = [
  { titulo: 'Primero', texto: 't1', imagen: '/img/a.jpg', enlace: '/productos', boton: 'Ver productos' },
  { titulo: 'Segundo', texto: 't2', imagen: '/img/b.jpg', enlace: '/ofertas', boton: 'Ver ofertas' },
  { titulo: 'Tercero', texto: 't3', imagen: '/img/c.jpg', enlace: '/categorias', boton: 'Ver categorías' },
];

function renderCarrusel(props = {}) {
  return render(
    <MemoryRouter>
      <Carrusel slides={slides} {...props} />
    </MemoryRouter>
  );
}

describe('Carrusel', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra el primer slide con su enlace', () => {
    renderCarrusel();

    expect(screen.getByRole('heading', { name: 'Primero' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver productos' })).toHaveAttribute(
      'href',
      '/productos'
    );
  });

  it('avanza y retrocede con los botones, dando la vuelta al llegar al borde', () => {
    renderCarrusel();

    fireEvent.click(screen.getByRole('button', { name: /slide siguiente/i }));
    expect(screen.getByRole('heading', { name: 'Segundo' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /slide anterior/i }));
    fireEvent.click(screen.getByRole('button', { name: /slide anterior/i }));
    expect(screen.getByRole('heading', { name: 'Tercero' })).toBeInTheDocument();
  });

  it('salta al slide elegido con los indicadores', () => {
    renderCarrusel();

    fireEvent.click(screen.getByRole('button', { name: /ir al slide 3/i }));

    expect(screen.getByRole('heading', { name: 'Tercero' })).toBeInTheDocument();
  });

  it('avanza solo cuando pasa el tiempo del intervalo', () => {
    vi.useFakeTimers();
    renderCarrusel({ intervalo: 1000 });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole('heading', { name: 'Segundo' })).toBeInTheDocument();
  });

  it('no dibuja nada si no hay slides', () => {
    const { container } = renderCarrusel({ slides: [] });

    expect(container).toBeEmptyDOMElement();
  });
});
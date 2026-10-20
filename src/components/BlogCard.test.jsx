import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogCard from './BlogCard';

const articulo = {
  id: 'prueba-1',
  categoria: 'Tecnología',
  titulo: 'Un artículo de prueba',
  fecha: '1 enero 2025',
  imagen: '/img/prueba.jpg',
  resumen: 'Resumen del artículo de prueba.',
};

function renderCard() {
  return render(
    <MemoryRouter>
      <BlogCard articulo={articulo} />
    </MemoryRouter>
  );
}

describe('BlogCard', () => {
  it('muestra categoría, título, resumen y fecha', () => {
    renderCard();

    expect(screen.getByText('Tecnología')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Un artículo de prueba' })).toBeInTheDocument();
    expect(screen.getByText('Resumen del artículo de prueba.')).toBeInTheDocument();
    expect(screen.getByText('1 enero 2025')).toBeInTheDocument();
  });

  it('el enlace "Leer más" apunta a la ruta del artículo', () => {
    renderCard();

    expect(screen.getByRole('link', { name: 'Leer más' })).toHaveAttribute(
      'href',
      '/blog/prueba-1'
    );
  });
});
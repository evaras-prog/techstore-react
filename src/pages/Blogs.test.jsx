import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blogs from './Blogs';

function renderBlogs() {
  return render(
    <MemoryRouter>
      <Blogs />
    </MemoryRouter>
  );
}

describe('Blogs', () => {
  it('muestra el encabezado del blog', () => {
    renderBlogs();

    expect(screen.getByRole('heading', { name: 'Blog TechStore' })).toBeInTheDocument();
  });

  it('muestra una tarjeta con su enlace por cada artículo', () => {
    renderBlogs();

    const enlaces = screen.getAllByRole('link', { name: 'Leer más' });

    expect(enlaces).toHaveLength(2);
    expect(enlaces[0]).toHaveAttribute('href', '/blog/laptops-2025');
  });
});
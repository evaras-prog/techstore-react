import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DetalleBlog from './DetalleBlog';

function renderDetalle(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/blog/:id" element={<DetalleBlog />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('DetalleBlog', () => {
  it('muestra el artículo indicado en la URL', () => {
    renderDetalle('/blog/laptops-2025');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Las mejores laptops del 2025 para estudiantes',
      })
    ).toBeInTheDocument();
  });

  it('muestra todas las secciones y la conclusión', () => {
    renderDetalle('/blog/laptops-2025');

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
    expect(screen.getByText(/Conclusión:/)).toBeInTheDocument();
  });

  it('muestra un aviso si el artículo no existe', () => {
    renderDetalle('/blog/no-existe');

    expect(screen.getByText('Artículo no encontrado.')).toBeInTheDocument();
  });
});
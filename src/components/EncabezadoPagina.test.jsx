import { render, screen } from '@testing-library/react';
import EncabezadoPagina from './EncabezadoPagina';

describe('EncabezadoPagina', () => {
  it('muestra el título y el subtítulo', () => {
    render(<EncabezadoPagina titulo="Nosotros" subtitulo="Conoce al equipo" />);

    expect(screen.getByRole('heading', { name: 'Nosotros' })).toBeInTheDocument();
    expect(screen.getByText('Conoce al equipo')).toBeInTheDocument();
  });

  it('no muestra subtítulo si no se entrega', () => {
    const { container } = render(<EncabezadoPagina titulo="Blog" />);

    expect(container.querySelector('p')).toBeNull();
  });
});
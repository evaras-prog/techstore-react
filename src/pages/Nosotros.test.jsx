import { render, screen } from '@testing-library/react';
import Nosotros from './Nosotros';

describe('Nosotros', () => {
  it('muestra el encabezado y la presentación de la tienda', () => {
    render(<Nosotros />);

    expect(screen.getByRole('heading', { name: 'Sobre Nosotros' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '¿Quiénes somos?' })).toBeInTheDocument();
  });

  it('muestra las tarjetas de misión, visión y valores', () => {
    render(<Nosotros />);

    expect(screen.getByRole('heading', { name: 'Misión' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Visión' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Valores' })).toBeInTheDocument();
  });
});
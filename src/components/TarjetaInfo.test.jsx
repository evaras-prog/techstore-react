import { render, screen } from '@testing-library/react';
import TarjetaInfo from './TarjetaInfo';

describe('TarjetaInfo', () => {
  it('muestra el título y el texto recibidos por props', () => {
    render(<TarjetaInfo icono="🎯" titulo="Misión" texto="Ofrecer calidad" />);

    expect(screen.getByRole('heading', { name: 'Misión' })).toBeInTheDocument();
    expect(screen.getByText('Ofrecer calidad')).toBeInTheDocument();
  });
});
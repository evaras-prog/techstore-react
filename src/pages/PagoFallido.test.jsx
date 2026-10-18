import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PagoFallido from './PagoFallido';

describe('PagoFallido', () => {
  it('informa el rechazo y permite reintentar', () => {
    render(
      <MemoryRouter>
        <PagoFallido />
      </MemoryRouter>
    );

    expect(screen.getByText(/No se pudo realizar el pago/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /intentar nuevamente/i })
    ).toHaveAttribute('href', '/checkout');
  });
});
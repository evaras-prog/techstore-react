import { render, screen, fireEvent } from '@testing-library/react';
import FiltroProductos from './FiltroProductos';

describe('FiltroProductos', () => {
  it('avisa el texto escrito mediante onBusquedaChange', () => {
    const onBusquedaChange = vi.fn();

    render(
      <FiltroProductos
        busqueda=""
        categoria="Todas"
        categorias={['Todas', 'Accesorios']}
        onBusquedaChange={onBusquedaChange}
        onCategoriaChange={() => {}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/buscar producto/i), {
      target: { value: 'lap' },
    });

    expect(onBusquedaChange).toHaveBeenCalledWith('lap');
  });
});
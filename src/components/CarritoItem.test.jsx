import { render, screen, fireEvent } from '@testing-library/react';
import CarritoItem from './CarritoItem';

const item = {
  codigo: 'TEC001',
  nombre: 'Laptop Ultrabook Pro',
  precio: 100000,
  oferta: false,
  precioOferta: 0,
  imagen: '/img/laptop.jpg',
  cantidad: 2,
};

function renderItem(props = {}) {
  return render(
    <CarritoItem
      item={item}
      onCambiarCantidad={() => {}}
      onQuitar={() => {}}
      {...props}
    />
  );
}

describe('CarritoItem', () => {
  it('muestra el subtotal según precio y cantidad', () => {
    renderItem();

    expect(screen.getByText(/200\.000/)).toBeInTheDocument();
  });

  it('usa el precio de oferta cuando el producto está en oferta', () => {
    renderItem({ item: { ...item, oferta: true, precioOferta: 80000 } });

    expect(screen.getByText(/160\.000/)).toBeInTheDocument();
  });

  it('pide aumentar la cantidad al presionar +', () => {
    const onCambiarCantidad = vi.fn();
    renderItem({ onCambiarCantidad });

    fireEvent.click(screen.getByRole('button', { name: /aumentar cantidad/i }));

    expect(onCambiarCantidad).toHaveBeenCalledWith('TEC001', 3);
  });

  it('pide disminuir la cantidad al presionar -', () => {
    const onCambiarCantidad = vi.fn();
    renderItem({ onCambiarCantidad });

    fireEvent.click(screen.getByRole('button', { name: /disminuir cantidad/i }));

    expect(onCambiarCantidad).toHaveBeenCalledWith('TEC001', 1);
  });

  it('pide quitar el producto al presionar Quitar', () => {
    const onQuitar = vi.fn();
    renderItem({ onQuitar });

    fireEvent.click(screen.getByRole('button', { name: /quitar/i }));

    expect(onQuitar).toHaveBeenCalledWith('TEC001');
  });
});
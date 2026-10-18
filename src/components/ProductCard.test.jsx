import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

const producto = {
  codigo: 'TEC001',
  nombre: 'Laptop Ultrabook Pro',
  descripcion: 'Notebook liviano',
  precio: 899990,
  categoria: 'Computación',
  imagen: '/img/laptop.jpg',
};

describe('ProductCard', () => {
  it('renderiza nombre, categoría y precio formateado', () => {
    render(<ProductCard producto={producto} onAgregar={() => {}} />);

    expect(screen.getByText('Laptop Ultrabook Pro')).toBeInTheDocument();
    expect(screen.getByText('Computación')).toBeInTheDocument();
    expect(screen.getByText(/899\.990/)).toBeInTheDocument();
  });

  it('usa la imagen y el texto alternativo recibidos por props', () => {
    render(<ProductCard producto={producto} onAgregar={() => {}} />);

    const imagen = screen.getByAltText('Laptop Ultrabook Pro');
    expect(imagen).toHaveAttribute('src', '/img/laptop.jpg');
  });

  it('llama a onAgregar con el producto al hacer clic en el botón', () => {
    const onAgregar = vi.fn();
    render(<ProductCard producto={producto} onAgregar={onAgregar} />);

    fireEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }));

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(producto);
  });
});
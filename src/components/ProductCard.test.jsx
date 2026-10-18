import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

const producto = {
  codigo: 'TEC001',
  nombre: 'Laptop Ultrabook Pro',
  descripcion: 'Notebook liviano',
  precio: 899990,
  categoria: 'Computación',
  imagen: '/img/laptop.jpg',
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <ProductCard producto={producto} onAgregar={() => {}} {...props} />
    </MemoryRouter>
  );
}

describe('ProductCard', () => {
  it('renderiza nombre, categoría y precio formateado', () => {
    renderCard();

    expect(screen.getByText('Laptop Ultrabook Pro')).toBeInTheDocument();
    expect(screen.getByText('Computación')).toBeInTheDocument();
    expect(screen.getByText(/899\.990/)).toBeInTheDocument();
  });

  it('usa la imagen y el texto alternativo recibidos por props', () => {
    renderCard();

    const imagen = screen.getByAltText('Laptop Ultrabook Pro');
    expect(imagen).toHaveAttribute('src', '/img/laptop.jpg');
  });

  it('el enlace "Ver detalle" apunta a la ruta del producto', () => {
    renderCard();

    const enlace = screen.getByRole('link', { name: /ver detalle/i });
    expect(enlace).toHaveAttribute('href', '/producto/TEC001');
  });

  it('muestra el precio de oferta y el precio original tachado', () => {
    renderCard({
      producto: { ...producto, oferta: true, precioOferta: 699990 },
    });

    expect(screen.getByText(/899\.990/)).toBeInTheDocument();
    expect(screen.getByText(/699\.990/)).toBeInTheDocument();
  });  

  it('llama a onAgregar con el producto al hacer clic en el botón', () => {
    const onAgregar = vi.fn();
    renderCard({ onAgregar });

    fireEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }));

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(producto);
  });
});
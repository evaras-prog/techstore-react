import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Productos from './Productos';
import { CarritoProvider } from '../context/CarritoContext';

function renderProductos() {
  return render(
    <CarritoProvider>
      <MemoryRouter>
        <Productos />
      </MemoryRouter>
    </CarritoProvider>
  );
}

describe('Productos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra todos los productos al inicio', () => {
    renderProductos();

    expect(screen.getAllByRole('button', { name: /agregar al carrito/i })).toHaveLength(6);
  });

  it('filtra los productos por el texto buscado', () => {
    renderProductos();

    fireEvent.change(screen.getByPlaceholderText(/buscar producto/i), {
      target: { value: 'lap' },
    });

    expect(screen.getAllByRole('button', { name: /agregar al carrito/i })).toHaveLength(1);
    expect(screen.getByText('Laptop Ultrabook Pro')).toBeInTheDocument();
  });

  it('filtra los productos por categoría', () => {
    renderProductos();

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Accesorios' },
    });

    expect(screen.getAllByRole('button', { name: /agregar al carrito/i })).toHaveLength(2);
    expect(screen.queryByText('Laptop Ultrabook Pro')).not.toBeInTheDocument();
  });

  it('muestra un aviso cuando ningún producto coincide', () => {
    renderProductos();

    fireEvent.change(screen.getByPlaceholderText(/buscar producto/i), {
      target: { value: 'zzz' },
    });

    expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument();
  });
});
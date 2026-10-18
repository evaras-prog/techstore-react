import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductList from './ProductList';

const productos = [
  { codigo: 'A1', nombre: 'Producto Uno', descripcion: 'd', precio: 1000, categoria: 'Cat', imagen: '/img/a.jpg' },
  { codigo: 'A2', nombre: 'Producto Dos', descripcion: 'd', precio: 2000, categoria: 'Cat', imagen: '/img/b.jpg' },
  { codigo: 'A3', nombre: 'Producto Tres', descripcion: 'd', precio: 3000, categoria: 'Cat', imagen: '/img/c.jpg' },
];

describe('ProductList', () => {
  it('renderiza una tarjeta por cada producto', () => {
    render(
      <MemoryRouter>
        <ProductList productos={productos} onAgregar={() => {}} />
      </MemoryRouter>
    );

    expect(
      screen.getAllByRole('button', { name: /agregar al carrito/i })
    ).toHaveLength(3);
    expect(screen.getByText('Producto Dos')).toBeInTheDocument();
  });

  it('muestra un mensaje cuando la lista está vacía', () => {
    render(
      <MemoryRouter>
        <ProductList productos={[]} onAgregar={() => {}} mensajeVacio="Sin datos" />
      </MemoryRouter>
    );

    expect(screen.getByText('Sin datos')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
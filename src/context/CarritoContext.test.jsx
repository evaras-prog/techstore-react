import { render, screen, fireEvent } from '@testing-library/react';
import { CarritoProvider, useCarrito } from './CarritoContext';

const productoA = { codigo: 'A1', nombre: 'Producto A', precio: 1000, oferta: false, precioOferta: 0 };
const productoB = { codigo: 'B1', nombre: 'Producto B', precio: 5000, oferta: true, precioOferta: 3000 };

function Panel() {
  const { items, agregar, quitar, cambiarCantidad, total, cantidadTotal } = useCarrito();

  return (
    <div>
      <p data-testid="lineas">{items.length}</p>
      <p data-testid="cantidad">{cantidadTotal}</p>
      <p data-testid="total">{total}</p>
      <button onClick={() => agregar(productoA)}>agregar A</button>
      <button onClick={() => agregar(productoB)}>agregar B</button>
      <button onClick={() => quitar('A1')}>quitar A</button>
      <button onClick={() => cambiarCantidad('A1', 0)}>cantidad cero</button>
      <button onClick={() => cambiarCantidad('A1', 5)}>cantidad cinco</button>
    </div>
  );
}

function renderPanel() {
  return render(
    <CarritoProvider>
      <Panel />
    </CarritoProvider>
  );
}

function presionar(nombre) {
  fireEvent.click(screen.getByRole('button', { name: nombre }));
}

describe('CarritoContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('agregar crea una línea y repetir el producto aumenta su cantidad', () => {
    renderPanel();

    presionar('agregar A');
    presionar('agregar A');

    expect(screen.getByTestId('lineas')).toHaveTextContent('1');
    expect(screen.getByTestId('cantidad')).toHaveTextContent('2');
    expect(screen.getByTestId('total')).toHaveTextContent('2000');
  });

  it('usa el precio de oferta para calcular el total', () => {
    renderPanel();

    presionar('agregar B');

    expect(screen.getByTestId('total')).toHaveTextContent('3000');
  });

  it('quitar elimina la línea del producto', () => {
    renderPanel();

    presionar('agregar A');
    presionar('agregar B');
    presionar('quitar A');

    expect(screen.getByTestId('lineas')).toHaveTextContent('1');
  });

  it('una cantidad menor o igual a cero elimina la línea', () => {
    renderPanel();

    presionar('agregar A');
    presionar('cantidad cero');

    expect(screen.getByTestId('lineas')).toHaveTextContent('0');
  });

  it('cambia la cantidad solo de la línea indicada', () => {
    renderPanel();

    presionar('agregar A');
    presionar('agregar B');
    presionar('agregar A');
    presionar('cantidad cinco');

    expect(screen.getByTestId('cantidad')).toHaveTextContent('6');
  });

  it('guarda el carrito en localStorage', () => {
    renderPanel();

    presionar('agregar A');

    expect(JSON.parse(localStorage.getItem('carrito'))).toHaveLength(1);
  });

  it('recupera el carrito guardado al iniciar', () => {
    localStorage.setItem('carrito', JSON.stringify([{ ...productoA, cantidad: 3 }]));

    renderPanel();

    expect(screen.getByTestId('cantidad')).toHaveTextContent('3');
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Checkout from './Checkout';
import CompraExitosa from './CompraExitosa';
import PagoFallido from './PagoFallido';
import { AuthProvider } from '../context/AuthContext';
import { CarritoProvider } from '../context/CarritoContext';
import { obtenerProductos } from '../data/productosService';

function stockDe(codigo) {
  return obtenerProductos().find((p) => p.codigo === codigo).stock;
}

const producto = {
  codigo: 'TEC001',
  nombre: 'Laptop Ultrabook Pro',
  precio: 100000,
  oferta: false,
  precioOferta: 0,
  imagen: '/img/laptop.jpg',
  cantidad: 1,
};

const productoEnOferta = {
  codigo: 'TEC003',
  nombre: 'Audífonos Noise Pro',
  precio: 129990,
  oferta: true,
  precioOferta: 99990,
  imagen: '/img/audifonos.jpg',
  cantidad: 1,
};

function renderCheckout() {
  return render(
    <AuthProvider>
      <CarritoProvider>
        <MemoryRouter initialEntries={['/checkout']}>
          <Routes>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/compra-exitosa" element={<CompraExitosa />} />
            <Route path="/pago-fallido" element={<PagoFallido />} />
          </Routes>
        </MemoryRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), {
    target: { value: valor },
  });
}

function completarFormulario(tarjeta) {
  escribir('Nombre', 'Ana');
  escribir('Apellidos', 'Pérez');
  escribir('Correo', 'ana@correo.cl');
  escribir('Dirección', 'Av. Siempre Viva 123');
  escribir('Región', 'Región Metropolitana de Santiago');
  escribir('Comuna', 'Santiago');
  escribir('Número de tarjeta', tarjeta);
}

function presionarPagar() {
  fireEvent.click(screen.getByRole('button', { name: /pagar/i }));
}

describe('Checkout', () => {
  beforeEach(() => {
    localStorage.clear();
  });

      it('completa una compra con retiro en tienda y un producto en oferta', () => {
        localStorage.setItem('carrito', JSON.stringify([productoEnOferta]));
        renderCheckout();

    fireEvent.click(screen.getByLabelText('Retiro en tienda'));
    escribir('Nombre', 'Ana');
    escribir('Apellidos', 'Pérez');
    escribir('Correo', 'ana@correo.cl');
    escribir('Número de tarjeta', '4111 1111 1111 1111');
    presionarPagar();

    expect(screen.getByText(/¡Compra exitosa!/)).toBeInTheDocument();
    const [pedido] = JSON.parse(localStorage.getItem('pedidosAdmin'));
    expect(pedido.entrega).toBe('retiro');
    expect(pedido.direccion).toBe('');
    expect(pedido.items[0].precioUnitario).toBe(99990);
  });

  it('autocompleta los datos del formulario cuando hay sesión iniciada', () => {
    localStorage.setItem('carrito', JSON.stringify([producto]));
    localStorage.setItem(
      'usuarioActivo',
      JSON.stringify({
        nombre: 'Ana',
        apellidos: 'Pérez',
        correo: 'ana@correo.cl',
        direccion: 'Av. Providencia 1234',
        region: 'Región Metropolitana de Santiago',
        comuna: 'Santiago',
        tipo: 'Cliente',
      })
    );
    renderCheckout();

    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana');
    expect(screen.getByLabelText('Dirección')).toHaveValue('Av. Providencia 1234');
    expect(screen.getByLabelText('Comuna')).toHaveValue('Santiago');
  });

  it('limpia la comuna al cambiar la región', () => {
    localStorage.setItem('carrito', JSON.stringify([producto]));
    renderCheckout();

    escribir('Región', 'Región Metropolitana de Santiago');
    escribir('Comuna', 'Santiago');
    escribir('Región', 'Región de Valparaíso');

    expect(screen.getByLabelText('Comuna')).toHaveValue('');
  });

  it('avisa cuando el carrito está vacío', () => {
    renderCheckout();

    expect(
      screen.getByText('No tienes productos en el carrito.')
    ).toBeInTheDocument();
  });

  it('muestra errores de validación al enviar el formulario vacío', () => {
    localStorage.setItem('carrito', JSON.stringify([producto]));
    renderCheckout();

    presionarPagar();

    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument();
    expect(
      screen.getByText('La tarjeta debe tener 16 dígitos.')
    ).toBeInTheDocument();
  });

  it('oculta los campos de dirección al elegir retiro en tienda', () => {
    localStorage.setItem('carrito', JSON.stringify([producto]));
    renderCheckout();

    expect(screen.getByLabelText('Dirección')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Retiro en tienda'));

    expect(screen.queryByLabelText('Dirección')).not.toBeInTheDocument();
  });

  it('completa la compra con una tarjeta aprobada y vacía el carrito', () => {
    localStorage.setItem('carrito', JSON.stringify([producto]));
    renderCheckout();

    completarFormulario('4111 1111 1111 1111');
    presionarPagar();

    expect(screen.getByText(/¡Compra exitosa!/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('carrito'))).toEqual([]);
    expect(JSON.parse(localStorage.getItem('pedidosAdmin'))).toHaveLength(1);
  });

  it('rechaza una tarjeta terminada en 0000 y conserva el carrito', () => {
    localStorage.setItem('carrito', JSON.stringify([producto]));
    renderCheckout();

    completarFormulario('4111 1111 1111 0000');
    presionarPagar();

    expect(screen.getByText(/No se pudo realizar el pago/)).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('carrito'))).toHaveLength(1);
  });

    it('descuenta del stock las unidades compradas cuando el pago es aprobado', () => {
    const stockInicial = stockDe('TEC001');
    localStorage.setItem('carrito', JSON.stringify([{ ...producto, cantidad: 2 }]));
    renderCheckout();

    completarFormulario('4111 1111 1111 1111');
    presionarPagar();

    expect(stockDe('TEC001')).toBe(stockInicial - 2);
  });

  it('no descuenta stock cuando el pago es rechazado', () => {
    const stockInicial = stockDe('TEC001');
    localStorage.setItem('carrito', JSON.stringify([{ ...producto, cantidad: 2 }]));
    renderCheckout();

    completarFormulario('4111 1111 1111 0000');
    presionarPagar();

    expect(stockDe('TEC001')).toBe(stockInicial);
  });
});
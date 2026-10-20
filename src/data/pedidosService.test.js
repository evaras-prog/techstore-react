import {
  obtenerPedidos,
  crearPedido,
  actualizarEstadoPedido,
  eliminarPedido,
} from './pedidosService';

describe('pedidosService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('parte sin pedidos', () => {
    expect(obtenerPedidos()).toEqual([]);
  });

  it('crea un pedido con id, fecha y estado, y lo guarda', () => {
    const pedido = crearPedido({
      cliente: 'Esteban Pérez',
      total: 1000,
      items: [],
    });

    expect(pedido.id).toMatch(/^PED-/);
    expect(pedido.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(pedido.estado).toBe('Pagado');
    expect(obtenerPedidos()).toHaveLength(1);
  });

  it('actualiza correctamente el estado de un pedido', () => {
    const pedido = crearPedido({
      cliente: 'Esteban Pérez',
      total: 1000,
      items: [],
    });

    actualizarEstadoPedido(
      pedido.id,
      'En preparación'
    );

    const pedidos = obtenerPedidos();

    expect(pedidos[0].estado).toBe(
      'En preparación'
    );
  });

  it('elimina correctamente un pedido', () => {
    const pedido = crearPedido({
      cliente: 'Esteban Pérez',
      total: 1000,
      items: [],
    });

    eliminarPedido(pedido.id);

    expect(obtenerPedidos()).toEqual([]);
  });

  it('lanza error si el pedido no existe', () => {
    expect(() =>
      actualizarEstadoPedido(
        'PED-INEXISTENTE',
        'Enviado'
      )
    ).toThrow('Pedido no encontrado');

    expect(() =>
      eliminarPedido('PED-INEXISTENTE')
    ).toThrow('Pedido no encontrado');
  });
});
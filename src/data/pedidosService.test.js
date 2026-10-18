import { obtenerPedidos, crearPedido } from './pedidosService';

describe('pedidosService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('parte sin pedidos', () => {
    expect(obtenerPedidos()).toEqual([]);
  });

  it('crea un pedido con id, fecha y estado, y lo guarda', () => {
    const pedido = crearPedido({ cliente: 'Ana Pérez', total: 1000, items: [] });

    expect(pedido.id).toMatch(/^PED-/);
    expect(pedido.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(pedido.estado).toBe('Pagado');
    expect(obtenerPedidos()).toHaveLength(1);
  });
});
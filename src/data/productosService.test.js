import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    descontarStock,
} from './productosService';

describe('productosService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('carga los 6 productos base la primera vez', () => {
    expect(obtenerProductos().length).toBe(6);
    });

    it('crea un producto nuevo', () => {
        crearProducto({ codigo: 'TEC999', nombre: 'Mouse', precio: 10000});
        expect(obtenerProductos().length).toBe(7);
    });

    it('no permite crear un código duplicado', () => {
        expect(() => crearProducto({ codigo: 'TEC001', nombre: 'Repetido' })).toThrow();
    });

    it('actualiza el precio de un producto', () => {
        actualizarProducto('TEC001', { precio: 1 });
        const producto = obtenerProductos().find((p) => p.codigo === 'TEC001');
        expect(producto.precio).toBe(1);
    });

    it('elimina un producto', () => {
        eliminarProducto('TEC001');
        expect(obtenerProductos().length).toBe(5);
    });

      it('actualizar un producto inexistente lanza un error', () => {
        expect(() => actualizarProducto('NO-EXISTE', { precio: 1 })).toThrow(
            'Producto no encontrado'
    );
  });

      it('descuenta el stock de los productos comprados y deja el resto igual', () => {
        const antes = obtenerProductos();
        const stockTEC001 = antes.find((p) => p.codigo === 'TEC001').stock;
        const stockTEC002 = antes.find((p) => p.codigo === 'TEC002').stock;

        descontarStock([{ codigo: 'TEC001', cantidad: 3 }]);

        const despues = obtenerProductos();
        expect(despues.find((p) => p.codigo === 'TEC001').stock).toBe(stockTEC001 - 3);
        expect(despues.find((p) => p.codigo === 'TEC002').stock).toBe(stockTEC002);
    });

    it('el stock nunca queda bajo cero', () => {
        descontarStock([{ codigo: 'TEC003', cantidad: 999 }]);

        expect(obtenerProductos().find((p) => p.codigo === 'TEC003').stock).toBe(0);
    });
});


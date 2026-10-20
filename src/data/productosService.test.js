import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
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
});


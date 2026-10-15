import { PRODUCTOS_BASE } from "./datos";

const CLAVE = 'productosAdmin';

function leer() {
    const guardado = localStorage.getItem(CLAVE);
    if (!guardado) {
        localStorage.setItem(CLAVE, JSON.stringify(PRODUCTOS_BASE));
        return [...PRODUCTOS_BASE];
    }
    return JSON.parse(guardado);
}
    function escribir(lista) {
        localStorage.setItem(CLAVE, JSON.stringify(lista));
    }

    //READ
    export function obtenerProductos() {
        return leer();
    }

    export function obtenerProductosPorCodigo(codigo) {
        return leer().find((p) => p.codigo === codigo) || null;
    }

    //CREATE
    export function crearProducto(producto) {
        const lista = leer();
        if (lista.some((p)=> p.codigo === producto.codigo)) {
            throw new Error('Ya existe un producto con ese código');
        }
        lista.push(producto);
        escribir(lista);
        return producto;
    }

    //UPDATE    
    export function actualizarProducto(codigo, cambios) {
        const lista = leer();
        const indice = lista.findIndex((p) => p.codigo === codigo);
        if (indice === -1) {
            throw new Error('Producto no encontrado')
        }
        lista[indice] = { ...lista[indice], ...cambios };
        escribir(lista);
        return lista[indice];
    }

    //DELETE
    export function eliminarProducto(codigo) {
        escribir(leer().filter((p) => p.codigo !== codigo));
    }


import { useState } from 'react';
import { obtenerProductos } from '../data/productosService';
import ProductCard from '../components/ProductCard';
import FiltroProductos from '../components/FiltroProductos';
import { useCarrito } from '../context/CarritoContext';

function Productos() {
    const [productos] = useState(() => obtenerProductos());
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('Todas');
    const { agregar } = useCarrito();

    const categorias = ['Todas', ...new Set(productos.map((p) => p.categoria))];

    const filtrados = productos.filter((p) => {
      const coincideTexto = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoria === 'Todas' || p.categoria === categoria;
      return coincideTexto && coincideCategoria;
    });

    return (
    <div className="container py-4">
      <h1 className="mb-4">Productos</h1>

      <FiltroProductos
        busqueda={busqueda}
        categoria={categoria}
        categorias={categorias}
        onBusquedaChange={setBusqueda}
        onCategoriaChange={setCategoria}
      />

      {filtrados.length === 0 ? (
        <div className="alert alert-warning">No se encontraron productos.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filtrados.map((producto) => (
            <div className="col" key={producto.codigo}>
              <ProductCard producto={producto} onAgregar={agregar} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Productos;
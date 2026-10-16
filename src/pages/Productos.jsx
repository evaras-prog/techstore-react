import { useState } from 'react';
import { obtenerProductos } from '../data/productosService';
import ProductCard from '../components/ProductCard';
import { useCarrito } from '../context/CarritoContext';

function Productos() {
    const [productos] = useState(() => obtenerProductos());
    const { agregar } = useCarrito();

    return (
    <div className="container py-4">
      <h1 className="mb-4">Productos</h1>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {productos.map((producto) => (
          <div className="col" key={producto.codigo}>
            <ProductCard producto={producto} onAgregar={agregar} />
          </div>
        ))}
      </div>
    </div>        
    );
}

export default Productos;
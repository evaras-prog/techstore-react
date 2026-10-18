import { useState } from 'react';
import { obtenerProductos } from '../data/productosService';
import ProductList from '../components/ProductList';
import { useCarrito } from '../context/CarritoContext';

function Categorias() {
  const [productos] = useState(() => obtenerProductos());
  const { agregar } = useCarrito();

  const categorias = [...new Set(productos.map((p) => p.categoria))];

  return (
    <div className="container py-4">
      <h1 className="mb-4">Categorías</h1>

      {categorias.map((categoria) => {
        const delaCategoria = productos.filter((p) => p.categoria === categoria);

        return (
          <section key={categoria} className="mb-5">
            <h2 className="h4 border-bottom pb-2 mb-3">
              {categoria}
              <span className="badge bg-secondary ms-2">{delaCategoria.length}</span>
            </h2>
            <ProductList productos={delaCategoria} onAgregar={agregar} />
          </section>
        );
      })}
    </div>
  );
}

export default Categorias;
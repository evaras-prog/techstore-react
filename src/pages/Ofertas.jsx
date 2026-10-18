import { useState } from 'react';
import { obtenerProductos } from '../data/productosService';
import ProductList from '../components/ProductList';
import { useCarrito } from '../context/CarritoContext';

function Ofertas() {
  const [productos] = useState(() =>
    obtenerProductos().filter((p) => p.oferta)
  );
  const { agregar } = useCarrito();

  return (
    <div className="container py-4">
      <h1 className="mb-4">Ofertas</h1>
      <ProductList
        productos={productos}
        onAgregar={agregar}
        mensajeVacio="Por ahora no hay productos en oferta."
      />
    </div>
  );
}

export default Ofertas;
import { useState } from 'react';
import { obtenerProductos } from '../data/productosService';
import ProductList from '../components/ProductList';
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

      <ProductList productos={filtrados} onAgregar={agregar} />
    </div>
  );
}

export default Productos;
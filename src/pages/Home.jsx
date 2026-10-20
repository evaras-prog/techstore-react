import { useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../data/productosService';
import { useCarrito } from '../context/CarritoContext';
import Carrusel from '../components/Carrusel';
import ProductList from '../components/ProductList';

const SLIDES = [
  {
    titulo: 'Nuevos lanzamientos',
    texto: 'Descubre los últimos productos tecnológicos en nuestra tienda.',
    imagen: '/img/laptop.jpg',
    enlace: '/productos',
    boton: 'Ver productos',
  },
  {
    titulo: 'Ofertas de la semana',
    texto: 'Audífonos y teclados con precios rebajados por tiempo limitado.',
    imagen: '/img/audifonos.jpg',
    enlace: '/ofertas',
    boton: 'Ver ofertas',
  },
  {
    titulo: 'Explora por categorías',
    texto: 'Computación, telefonía, tablets, monitores y accesorios en un solo lugar.',
    imagen: '/img/smartphone.jpg',
    enlace: '/categorias',
    boton: 'Ver categorías',
  },
];

function Home() {
  const [productos] = useState(() => obtenerProductos());
  const { agregar } = useCarrito();

  const categorias = [...new Set(productos.map((p) => p.categoria))];
  const ofertas = productos.filter((p) => p.oferta).slice(0, 3);
  const destacados = productos.filter((p) => !p.oferta).slice(0, 3);

  return (
    <div className="container py-4">
      <h1 className="visually-hidden">TechStore, tienda de tecnología</h1>

      <Carrusel slides={SLIDES} />

      <section aria-label="Categorías" className="mb-5">
        <h2 className="h3 mb-3">Categorías</h2>
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
          {categorias.map((categoria) => {
            const delaCategoria = productos.filter((p) => p.categoria === categoria);
            return (
              <div className="col" key={categoria}>
                <Link
                  to="/categorias"
                  className="card h-100 text-decoration-none text-dark"
                >
                  <img
                    src={delaCategoria[0].imagen}
                    alt={categoria}
                    className="card-img-top p-3"
                    style={{ height: '140px', objectFit: 'contain' }}
                  />
                  <div className="card-body text-center">
                    <h3 className="h6 card-title mb-0">{categoria}</h3>
                    <small className="text-muted">
                      {delaCategoria.length}{' '}
                      {delaCategoria.length === 1 ? 'producto' : 'productos'}
                    </small>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {ofertas.length > 0 && (
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h3 mb-0">Ofertas destacadas</h2>
            <Link to="/ofertas">Ver todas</Link>
          </div>
          <ProductList productos={ofertas} onAgregar={agregar} />
        </section>
      )}

      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Productos destacados</h2>
          <Link to="/productos">Ver todos</Link>
        </div>
        <ProductList productos={destacados} onAgregar={agregar} />
      </section>
    </div>
  );
}

export default Home;
import { obtenerArticulos } from '../data/blogs';
import EncabezadoPagina from '../components/EncabezadoPagina';
import BlogCard from '../components/BlogCard';

function Blogs() {
  const articulos = obtenerArticulos();

  return (
    <div className="container py-4">
      <EncabezadoPagina
        titulo="Blog TechStore"
        subtitulo="Guías, comparativas y novedades del mundo de la tecnología."
      />

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {articulos.map((articulo) => (
          <div className="col" key={articulo.id}>
            <BlogCard articulo={articulo} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;
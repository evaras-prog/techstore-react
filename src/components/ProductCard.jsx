import { formatoCLP } from '../data/datos';
import { Link } from 'react-router-dom';

function ProductCard({ producto, onAgregar }) {
    return (
        <div className='card h-100'>
        <img
            src={producto.imagen}
            className="card-img-top p-3"
            alt={producto.nombre}
            style={{ height: '200px', objectFit: 'contain' }}
        />
        <div className="card-body d-flex flex-column">
            <span className="badge bg-secondary align-self-start mb-2">
                {producto.categoria}
            </span>
            <h5 className="card-title">{producto.nombre}</h5>
            <p className="card-text text-muted small">{producto.descripcion}</p>

            <div className="mt-auto">
                {producto.oferta ? (
                <p className="mb-2">
                    <span className="text-decoration-line-through text-muted me-2">
                        {formatoCLP(producto.precio)}
                    </span>
                    <span className="fw-bold fs-5 text-danger">
                        {formatoCLP(producto.precioOferta)}
                    </span>
                </p>
                ) : (
                    <p className="fw-bold fs-5 mb-2">{formatoCLP(producto.precio)}</p>
                )}                
                <Link
                    to={`/producto/${producto.codigo}`}
                    className="btn btn-outline-secondary w-100 mb-2"
                >
                    Ver detalle
                </Link>
               <button
                className="btn btn-primary w-100"
                onClick={() => onAgregar(producto)}
               >
                Agregar al carrito
               </button>
            </div>  
        </div>
    </div>
    );
}

export default ProductCard;
import ProductCard from './ProductCard';

function ProductList({
    productos,
    onAgregar,
    mensajeVacio = 'No se encontraron productos.',
}) {
    if (productos.length === 0) {
        return <div className="alert alert-warning">{mensajeVacio}</div>;
    }

    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {productos.map((producto) => (
                <div className="col" key={producto.codigo}>
                    <ProductCard producto={producto} onAgregar={onAgregar} />
                </div>
            ))}
        </div>
    );
}

export default ProductList;
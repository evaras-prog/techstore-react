function FiltroProductos({
    busqueda,
    categoria,
    categorias,
    onBusquedaChange,
    onCategoriaChange,
}) {
    return (
        <div className="row g-2 mb-4">
            <div className="col-12 col-md-8">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar producto por nombre..."
                    value={busqueda}
                    onChange={(e) => onBusquedaChange(e.target.value)}
                />
            </div>
            <div className="col-12 col-md-4">
                <select
                    className="form-select"
                    value={categoria}
                    onChange={(e) => onCategoriaChange(e.target.value)}
                >
                    {categorias.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default FiltroProductos;
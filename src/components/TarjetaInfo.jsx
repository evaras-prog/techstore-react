function TarjetaInfo({ icono, titulo, texto }) {
  return (
    <div className="card h-100 text-center shadow-sm">
      <div className="card-body">
        <div className="fs-1 mb-2" aria-hidden="true">
          {icono}
        </div>
        <h2 className="h5 card-title">{titulo}</h2>
        <p className="card-text text-muted mb-0">{texto}</p>
      </div>
    </div>
  );
}

export default TarjetaInfo;
function EncabezadoPagina({ titulo, subtitulo }) {
  return (
    <header className="bg-dark text-white text-center rounded-3 py-5 px-3 mb-5">
      <h1 className="display-5 fw-bold mb-2">{titulo}</h1>
      {subtitulo && <p className="lead mb-0">{subtitulo}</p>}
    </header>
  );
}

export default EncabezadoPagina;
import EncabezadoPagina from '../components/EncabezadoPagina';
import TarjetaInfo from '../components/TarjetaInfo';

const VALORES = [
  {
    icono: '🎯',
    titulo: 'Misión',
    texto:
      'Ofrecer productos tecnológicos de calidad con la mejor relación precio-valor del mercado chileno.',
  },
  {
    icono: '👁️',
    titulo: 'Visión',
    texto: 'Ser la tienda de tecnología más confiable y cercana de Chile para el año 2027.',
  },
  {
    icono: '💡',
    titulo: 'Valores',
    texto:
      'Honestidad, innovación, servicio al cliente y compromiso con la calidad en cada entrega.',
  },
];

function Nosotros() {
  return (
    <div className="container py-4">
      <EncabezadoPagina
        titulo="Sobre Nosotros"
        subtitulo="Conoce la historia y el equipo detrás de TechStore."
      />

      <section className="mx-auto mb-5" style={{ maxWidth: '900px' }}>
        <h2 className="h3 text-center mb-3">¿Quiénes somos?</h2>
        <p className="text-center text-muted fs-5">
          TechStore nació en 2020 con una misión clara: acercar la tecnología de
          vanguardia a todos los chilenos, con precios justos, garantía real y
          atención personalizada. Hoy somos una de las tiendas online de tecnología de
          mayor crecimiento en Santiago.
        </p>
      </section>

      <section className="row row-cols-1 row-cols-md-3 g-4">
        {VALORES.map((valor) => (
          <div className="col" key={valor.titulo}>
            <TarjetaInfo {...valor} />
          </div>
        ))}
      </section>
    </div>
  );
}

export default Nosotros;
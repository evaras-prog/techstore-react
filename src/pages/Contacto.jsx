import { useState } from 'react';
import { validarContacto } from '../data/validacionesContacto';
import EncabezadoPagina from '../components/EncabezadoPagina';
import CampoFormulario from '../components/CampoFormulario';
import TarjetaInfo from '../components/TarjetaInfo';

const VACIO = { nombre: '', correo: '', asunto: '', mensaje: '' };

const DATOS_CONTACTO = [
  { icono: '📍', titulo: 'Dirección', texto: 'Av. Providencia 1234, Santiago' },
  { icono: '📞', titulo: 'Teléfono', texto: '+56 2 2345 6789' },
  { icono: '✉️', titulo: 'Correo', texto: 'contacto@techstore.cl' },
];

function Contacto() {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setEnviado(false);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    const nuevosErrores = validarContacto(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setEnviado(false);
      return;
    }

    setEnviado(true);
    setDatos(VACIO);
  };

  return (
    <div className="container py-4">
      <EncabezadoPagina
        titulo="Contáctanos"
        subtitulo="¿Tienes dudas sobre un producto, una garantía o un despacho? Escríbenos."
      />

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          {enviado && (
            <div className="alert alert-success" role="alert">
              ¡Mensaje enviado! Te responderemos pronto.
            </div>
          )}

          <form onSubmit={manejarEnvio} noValidate>
            <CampoFormulario
              label="Nombre completo"
              name="nombre"
              placeholder="Tu nombre"
              value={datos.nombre}
              onChange={manejarCambio}
              error={errores.nombre}
            />
            <CampoFormulario
              label="Correo electrónico"
              name="correo"
              type="email"
              placeholder="correo@ejemplo.com"
              value={datos.correo}
              onChange={manejarCambio}
              error={errores.correo}
            />
            <CampoFormulario
              label="Asunto"
              name="asunto"
              as="select"
              value={datos.asunto}
              onChange={manejarCambio}
              error={errores.asunto}
            >
              <option value="">-- Selecciona un asunto --</option>
              <option value="consulta">Consulta de producto</option>
              <option value="garantia">Garantía</option>
              <option value="despacho">Despacho</option>
              <option value="otro">Otro</option>
            </CampoFormulario>
            <CampoFormulario
              label="Mensaje"
              name="mensaje"
              as="textarea"
              rows={5}
              placeholder="Escribe tu mensaje aquí..."
              value={datos.mensaje}
              onChange={manejarCambio}
              error={errores.mensaje}
            />

            <button type="submit" className="btn btn-primary w-100">
              Enviar mensaje
            </button>
          </form>
        </div>

        <div className="col-12 col-lg-5">
          <div className="d-grid gap-3">
            {DATOS_CONTACTO.map((dato) => (
              <TarjetaInfo key={dato.titulo} {...dato} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;
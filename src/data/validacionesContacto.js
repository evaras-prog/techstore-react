const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_MENSAJE = 500;

export function validarContacto(datos) {
  const errores = {};

  if (!datos.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.';
  }
  if (!REGEX_CORREO.test(datos.correo)) {
    errores.correo = 'Ingresa un correo válido.';
  }
  if (!datos.asunto) {
    errores.asunto = 'Selecciona un asunto.';
  }

  const mensaje = datos.mensaje.trim();
  if (!mensaje) {
    errores.mensaje = 'El mensaje es obligatorio.';
  } else if (mensaje.length > MAX_MENSAJE) {
    errores.mensaje = `El mensaje no puede superar los ${MAX_MENSAJE} caracteres.`;
  }

  return errores;
}
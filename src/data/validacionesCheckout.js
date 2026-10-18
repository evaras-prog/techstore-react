const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarCheckout(datos) {
  const errores = {};

  if (!datos.nombre.trim()) {
    errores.nombre = 'Ingresa tu nombre.';
  }
  if (!datos.apellidos.trim()) {
    errores.apellidos = 'Ingresa tus apellidos.';
  }
  if (!REGEX_CORREO.test(datos.correo)) {
    errores.correo = 'Ingresa un correo válido.';
  }

  if (datos.entrega === 'despacho') {
    if (!datos.direccion.trim()) {
      errores.direccion = 'Ingresa la dirección de envío.';
    }
    if (!datos.region) {
      errores.region = 'Selecciona una región.';
    }
    if (!datos.comuna) {
      errores.comuna = 'Selecciona una comuna.';
    }
  }

  if (!/^\d{16}$/.test(datos.tarjeta.replace(/\s/g, ''))) {
    errores.tarjeta = 'La tarjeta debe tener 16 dígitos.';
  }

  return errores;
}
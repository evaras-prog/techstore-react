// Valida que el correo tenga un formato correcto.
export function validarCorreo(correo) {
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regexCorreo.test(correo.trim());
}

// Valida que la contraseña tenga entre 4 y 10 caracteres.
export function validarPassword(password) {
  return password.length >= 4 && password.length <= 10;
}

// Valida un RUN chileno utilizando el dígito verificador.
export function validarRun(run) {
  const runLimpio = String(run)
    .replace(/\./g, "")
    .replace(/-/g, "")
    .toUpperCase();

  if (!/^\d{7,8}[0-9K]$/.test(runLimpio)) {
    return false;
  }

  const cuerpo = runLimpio.slice(0, -1);
  const digitoVerificador = runLimpio.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;

    multiplicador =
      multiplicador === 7
        ? 2
        : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);

  let digitoEsperado;

  if (resto === 11) {
    digitoEsperado = "0";
  } else if (resto === 10) {
    digitoEsperado = "K";
  } else {
    digitoEsperado = String(resto);
  }

  return digitoVerificador === digitoEsperado;
}
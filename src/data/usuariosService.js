import { USUARIOS_BASE } from "./datos";

const CLAVE = "usuariosAdmin";

// Lee los usuarios desde localStorage.
// Si todavía no existen, carga los usuarios base.
function leer() {
  const guardado = localStorage.getItem(CLAVE);

  if (!guardado) {
    localStorage.setItem(CLAVE, JSON.stringify(USUARIOS_BASE));
    return [...USUARIOS_BASE];
  }

  return JSON.parse(guardado);
}

// Guarda la lista completa de usuarios en localStorage.
function escribir(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

// READ
export function obtenerUsuarios() {
  return leer();
}

// READ por correo
export function buscarPorCorreo(correo) {
  return (
    leer().find(
      (usuario) =>
        usuario.correo.toLowerCase() === correo.toLowerCase()
    ) || null
  );
}

// CREATE
export function crearUsuario(usuario) {
  const lista = leer();

  if (lista.some((u) => u.run === usuario.run)) {
    throw new Error("Ya existe un usuario con ese RUN");
  }

  if (
    lista.some(
      (u) =>
        u.correo.toLowerCase() === usuario.correo.toLowerCase()
    )
  ) {
    throw new Error("Ya existe un usuario con ese correo");
  }

  lista.push(usuario);
  escribir(lista);

  return usuario;
}

// UPDATE
export function actualizarUsuario(run, cambios) {
  const lista = leer();

  const indice = lista.findIndex(
    (usuario) => usuario.run === run
  );

  if (indice === -1) {
    throw new Error("Usuario no encontrado");
  }

  lista[indice] = {
    ...lista[indice],
    ...cambios,
  };

  escribir(lista);

  return lista[indice];
}

// DELETE
export function eliminarUsuario(run) {
  escribir(
    leer().filter(
      (usuario) => usuario.run !== run
    )
  );
}
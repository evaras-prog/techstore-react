import { USUARIOS_BASE } from "./datos";

import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  buscarPorCorreo,
} from "./usuariosService";

describe("usuariosService", () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it("carga los usuarios base cuando localStorage está vacío", () => {
    const usuarios = obtenerUsuarios();

    expect(usuarios).toHaveLength(USUARIOS_BASE.length);
    expect(usuarios[0].correo).toBe(USUARIOS_BASE[0].correo);
  });

  it("crea un usuario y permite buscarlo por correo", () => {
    const nuevoUsuario = {
      run: "444444444",
      nombre: "Victor",
      apellidos: "Cortez",
      correo: "victor@gmail.com",
      password: "1234",
      tipo: "Cliente",
      region: "Región Metropolitana de Santiago",
      comuna: "Santiago",
      direccion: "Av. Principal 123",
    };

    crearUsuario(nuevoUsuario);

    const encontrado = buscarPorCorreo("VICTOR@GMAIL.COM");

    expect(encontrado).toEqual(nuevoUsuario);
  });

  it("actualiza y elimina correctamente un usuario", () => {
    const usuario = {
      run: "555555555",
      nombre: "Usuario",
      apellidos: "Prueba",
      correo: "prueba@gmail.com",
      password: "1234",
      tipo: "Cliente",
      region: "Región Metropolitana de Santiago",
      comuna: "Santiago",
      direccion: "Calle 123",
    };

    crearUsuario(usuario);

    const actualizado = actualizarUsuario(
      "555555555",
      { comuna: "Maipú" }
    );

    expect(actualizado.comuna).toBe("Maipú");

    eliminarUsuario("555555555");

    expect(
      buscarPorCorreo("prueba@gmail.com")
    ).toBeNull();
  });

});
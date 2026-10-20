import {
  validarCorreo,
  validarPassword,
  validarRun,
} from "./validaciones";

describe("validaciones", () => {

  it("acepta correo, contraseña y RUN válidos", () => {
    expect(validarCorreo("admin@duoc.cl")).toBe(true);

    expect(validarPassword("1234")).toBe(true);

    expect(validarRun("111111111")).toBe(true);
  });

  it("rechaza correo, contraseña y RUN inválidos", () => {
    expect(validarCorreo("correo-invalido")).toBe(false);

    expect(validarPassword("123")).toBe(false);

    expect(validarRun("111111112")).toBe(false);
  });

});
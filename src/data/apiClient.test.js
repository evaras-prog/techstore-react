import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  api,
  ApiError,
  borrarToken,
  guardarToken,
  obtenerToken,
} from "./apiClient";
import { simularApi } from "../testUtils";

describe("apiClient", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("guarda, lee y borra el token", () => {
    expect(obtenerToken()).toBeNull();

    guardarToken("abc");
    expect(obtenerToken()).toBe("abc");

    borrarToken();
    expect(obtenerToken()).toBeNull();
  });

  it("envía el token en el header Authorization cuando existe", async () => {
    guardarToken("mi-token");
    const fetchFalso = simularApi({ ok: true });

    await api("/productos");

    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toContain("/productos");
    expect(opciones.method).toBe("GET");
    expect(opciones.headers.Authorization).toBe("Bearer mi-token");
    expect(opciones.headers["Content-Type"]).toBeUndefined();
  });

  it("no envía Authorization si no hay token y envía el cuerpo como JSON", async () => {
    const fetchFalso = simularApi({ ok: true });

    await api("/auth/login", {
      metodo: "POST",
      cuerpo: { email: "a@b.cl", password: "123456" },
    });

    const [, opciones] = fetchFalso.mock.calls[0];
    expect(opciones.method).toBe("POST");
    expect(opciones.headers.Authorization).toBeUndefined();
    expect(opciones.headers["Content-Type"]).toBe("application/json");
    expect(opciones.body).toBe(
      JSON.stringify({ email: "a@b.cl", password: "123456" })
    );
  });

  it("devuelve el JSON de la respuesta", async () => {
    simularApi([{ id: 1, nombre: "Notebooks" }]);

    await expect(api("/categorias")).resolves.toEqual([
      { id: 1, nombre: "Notebooks" },
    ]);
  });

  it("devuelve null cuando la respuesta es 204 sin contenido", async () => {
    simularApi(null, 204);

    await expect(
      api("/productos/1", { metodo: "DELETE" })
    ).resolves.toBeNull();
  });

  it("lanza ApiError con estado, mensaje y detalles cuando la API responde con error", async () => {
    simularApi(
      { mensaje: "Datos inválidos", detalles: { nombre: "El nombre es obligatorio" } },
      400
    );

    const error = await api("/categorias", {
      metodo: "POST",
      cuerpo: { nombre: "" },
    }).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.estado).toBe(400);
    expect(error.message).toBe("Datos inválidos");
    expect(error.detalles).toEqual({ nombre: "El nombre es obligatorio" });
  });

  it("usa un mensaje por defecto si el error no trae cuerpo JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("sin cuerpo");
        },
      }))
    );

    const error = await api("/productos").catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.estado).toBe(500);
    expect(error.message).toBe("Error inesperado del servidor");
  });
});

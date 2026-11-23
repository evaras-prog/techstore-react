import { useEffect } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { AuthProvider, useAuth } from "./AuthContext";
import { sembrarSesion, simularApi } from "../testUtils";

// Componente de apoyo: muestra el usuario y deja el contexto accesible a las pruebas.
const captura = { actual: null };

function Sonda() {
  const auth = useAuth();

  useEffect(() => {
    captura.actual = auth;
  });

  return <p>{auth.usuario ? auth.usuario.nombre : "sin sesión"}</p>;
}

function renderizar() {
  return render(
    <AuthProvider>
      <Sonda />
    </AuthProvider>
  );
}

const respuestaAdmin = {
  token: "token-nuevo",
  nombre: "Admin",
  email: "admin@techstore.cl",
  rol: "ADMIN",
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("sin token empieza sin sesión y no llama a la API", () => {
    const fetchFalso = simularApi(respuestaAdmin);

    renderizar();

    expect(screen.getByText("sin sesión")).toBeInTheDocument();
    expect(fetchFalso).not.toHaveBeenCalled();
  });

  it("ignora un usuario guardado si no hay token", () => {
    localStorage.setItem(
      "usuarioActivo",
      JSON.stringify({ nombre: "Ana", tipo: "Cliente" })
    );

    renderizar();

    expect(screen.getByText("sin sesión")).toBeInTheDocument();
  });

  it("al cargar con token, verifica y renueva la sesión con /auth/refresh", async () => {
    sembrarSesion({ nombre: "Ana", correo: "ana@correo.cl", tipo: "Cliente" });
    const fetchFalso = simularApi({
      token: "token-renovado",
      nombre: "Ana",
      email: "ana@correo.cl",
      rol: "CLIENTE",
    });

    renderizar();

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("token-renovado");
    });
    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toContain("/auth/refresh");
    expect(opciones.method).toBe("POST");
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("si el token venció, cierra la sesión y borra lo guardado", async () => {
    sembrarSesion({ nombre: "Ana", correo: "ana@correo.cl", tipo: "Cliente" });
    simularApi({ mensaje: "No autenticado" }, 401);

    renderizar();

    await waitFor(() => {
      expect(screen.getByText("sin sesión")).toBeInTheDocument();
    });
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("usuarioActivo")).toBeNull();
  });

  it("login guarda el token y traduce el rol al tipo de usuario", async () => {
    simularApi(respuestaAdmin);
    renderizar();

    await act(async () => {
      await captura.actual.login("admin@techstore.cl", "admin123");
    });

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBe("token-nuevo");
    expect(captura.actual.usuario).toEqual({
      nombre: "Admin",
      correo: "admin@techstore.cl",
      rol: "ADMIN",
      tipo: "Administrador",
    });
  });

  it("registrar crea la cuenta e inicia sesión como cliente", async () => {
    const fetchFalso = simularApi({
      token: "token-cliente",
      nombre: "Ana Pérez",
      email: "ana@correo.cl",
      rol: "CLIENTE",
    });
    renderizar();

    await act(async () => {
      await captura.actual.registrar({
        nombre: "Ana Pérez",
        correo: "ana@correo.cl",
        password: "123456",
      });
    });

    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toContain("/auth/registro");
    expect(JSON.parse(opciones.body)).toEqual({
      nombre: "Ana Pérez",
      email: "ana@correo.cl",
      password: "123456",
    });
    expect(captura.actual.usuario.tipo).toBe("Cliente");
    expect(localStorage.getItem("token")).toBe("token-cliente");
  });

  it("logout borra la sesión", async () => {
    simularApi(respuestaAdmin);
    renderizar();

    await act(async () => {
      await captura.actual.login("admin@techstore.cl", "admin123");
    });
    act(() => {
      captura.actual.logout();
    });

    expect(screen.getByText("sin sesión")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("usuarioActivo")).toBeNull();
  });
});

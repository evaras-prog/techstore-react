import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { AuthProvider } from "../context/AuthContext";
import { simularApi } from "../testUtils";
import Login from "./Login";

function renderLogin() {
  return render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
  );
}

async function enviar(user, correo, password) {
  await user.type(screen.getByLabelText("Correo"), correo);
  await user.type(screen.getByLabelText("Contraseña"), password);
  await user.click(screen.getByRole("button", { name: "Ingresar" }));
}

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("permite iniciar sesión con credenciales válidas", async () => {
    simularApi({
      token: "token-de-prueba",
      nombre: "Admin",
      email: "admin@techstore.cl",
      rol: "ADMIN",
    });

    renderLogin();
    await enviar(userEvent.setup(), "admin@techstore.cl", "admin123");

    await waitFor(() => {
      const guardado = JSON.parse(localStorage.getItem("usuarioActivo"));
      expect(guardado.nombre).toBe("Admin");
      expect(guardado.tipo).toBe("Administrador");
    });
    expect(localStorage.getItem("token")).toBe("token-de-prueba");
  });

  it("muestra un mensaje cuando las credenciales son incorrectas", async () => {
    simularApi({ mensaje: "Credenciales inválidas" }, 401);

    renderLogin();
    await enviar(userEvent.setup(), "admin@techstore.cl", "mala");

    expect(await screen.findByRole("alert")).toHaveTextContent(
        "Correo o contraseña incorrectos."
    );
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("muestra un mensaje cuando no hay conexión con el servidor", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fallo")));

    renderLogin();
    await enviar(userEvent.setup(), "admin@techstore.cl", "admin123");

    expect(await screen.findByRole("alert")).toHaveTextContent(
        "No se pudo conectar con el servidor."
    );
  });
});
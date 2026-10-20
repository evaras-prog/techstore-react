import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";
import Login from "./Login";

describe("Login", () => {
  it("permite iniciar sesión con credenciales válidas", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText("Correo"),
      "admin@duoc.cl"
    );

    await user.type(
      screen.getByLabelText("Contraseña"),
      "1234"
    );

    await user.click(
      screen.getByRole("button", { name: "Ingresar" })
    );

    const usuarioGuardado = JSON.parse(
      localStorage.getItem("usuarioActivo")
    );

    expect(usuarioGuardado.nombre).toBe("Admin");
    expect(usuarioGuardado.tipo).toBe("Administrador");
  });
});
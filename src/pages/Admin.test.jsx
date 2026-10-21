import { render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import Admin from "./Admin";

vi.mock("../components/ProtectedRoute", () => ({
  default: ({ children }) => <>{children}</>,
}));

vi.mock("./admin/AdminProductos", () => ({
  default: () => <div>Vista Productos Admin</div>,
}));

vi.mock("./admin/AdminUsuarios", () => ({
  default: () => <div>Vista Usuarios Admin</div>,
}));

vi.mock("./admin/AdminPedidos", () => ({
  default: () => <div>Vista Pedidos Admin</div>,
}));

function renderAdmin(ruta) {
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route
          path="/admin/*"
          element={<Admin />}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("Admin", () => {
  it("renderiza el panel y sus enlaces de navegación", () => {
    renderAdmin("/admin/productos");

    expect(
      screen.getByRole("heading", {
        name: /panel de administración/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /productos/i })
    ).toHaveAttribute("href", "/admin/productos");

    expect(
      screen.getByRole("link", { name: /usuarios/i })
    ).toHaveAttribute("href", "/admin/usuarios");

    expect(
      screen.getByRole("link", { name: /pedidos/i })
    ).toHaveAttribute("href", "/admin/pedidos");
  });

  it("redirige /admin hacia productos", () => {
    renderAdmin("/admin");

    expect(
      screen.getByText("Vista Productos Admin")
    ).toBeInTheDocument();
  });

  it("muestra la administración de usuarios", () => {
    renderAdmin("/admin/usuarios");

    expect(
      screen.getByText("Vista Usuarios Admin")
    ).toBeInTheDocument();
  });

  it("muestra la administración de pedidos", () => {
    renderAdmin("/admin/pedidos");

    expect(
      screen.getByText("Vista Pedidos Admin")
    ).toBeInTheDocument();
  });
});
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import AdminPedidos from "./AdminPedidos";

const {
  mockObtenerPedidos,
  mockActualizarEstadoPedido,
  mockEliminarPedido,
} = vi.hoisted(() => ({
  mockObtenerPedidos: vi.fn(),
  mockActualizarEstadoPedido: vi.fn(),
  mockEliminarPedido: vi.fn(),
}));

vi.mock("../../data/pedidosService", () => ({
  obtenerPedidos: mockObtenerPedidos,
  actualizarEstadoPedido: mockActualizarEstadoPedido,
  eliminarPedido: mockEliminarPedido,
}));

const PEDIDO = {
  id: "PED-001",
  fecha: "2026-10-21",
  cliente: "Victor Cortez",
  correo: "victor@duoc.cl",
  entrega: "Despacho a domicilio",
  total: 150000,
  estado: "Pagado",
  items: [
    {
      codigo: "TEC001",
      cantidad: 2,
    },
    {
      codigo: "TEC002",
      cantidad: 1,
    },
  ],
};

describe("AdminPedidos", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockObtenerPedidos.mockReturnValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("muestra mensaje cuando no existen pedidos", () => {
    mockObtenerPedidos.mockReturnValue([]);

    render(<AdminPedidos />);

    expect(
      screen.getByRole("heading", {
        name: /gestión de pedidos/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("No existen pedidos registrados.")
    ).toBeInTheDocument();
  });

  it("renderiza correctamente los pedidos registrados", () => {
    mockObtenerPedidos.mockReturnValue([PEDIDO]);

    render(<AdminPedidos />);

    expect(
      screen.getByText("PED-001")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Victor Cortez")
    ).toBeInTheDocument();

    expect(
      screen.getByText("victor@duoc.cl")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Despacho a domicilio")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Pagado")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /eliminar/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("3")
    ).toBeInTheDocument();
  });

  it("actualiza correctamente el estado de un pedido", async () => {
    const user = userEvent.setup();

    const pedidoActualizado = {
      ...PEDIDO,
      estado: "En preparación",
    };

    mockObtenerPedidos
      .mockReturnValueOnce([PEDIDO])
      .mockReturnValueOnce([pedidoActualizado]);

    render(<AdminPedidos />);

    await user.selectOptions(
      screen.getByDisplayValue("Pagado"),
      "En preparación"
    );

    expect(
      mockActualizarEstadoPedido
    ).toHaveBeenCalledWith(
      "PED-001",
      "En preparación"
    );

    expect(
      screen.getByText(
        "Estado del pedido PED-001 actualizado correctamente."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("En preparación")
    ).toBeInTheDocument();
  });

  it("muestra error si falla la actualización del estado", async () => {
    const user = userEvent.setup();

    mockObtenerPedidos.mockReturnValue([PEDIDO]);

    mockActualizarEstadoPedido.mockImplementation(() => {
      throw new Error("Pedido no encontrado");
    });

    render(<AdminPedidos />);

    await user.selectOptions(
      screen.getByDisplayValue("Pagado"),
      "Enviado"
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Pedido no encontrado");
  });

  it("no elimina el pedido cuando el usuario cancela la confirmación", async () => {
    const user = userEvent.setup();

    mockObtenerPedidos.mockReturnValue([PEDIDO]);

    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<AdminPedidos />);

    await user.click(
      screen.getByRole("button", {
        name: /eliminar/i,
      })
    );

    expect(
      window.confirm
    ).toHaveBeenCalledWith(
      "¿Deseas eliminar el pedido PED-001?"
    );

    expect(
      mockEliminarPedido
    ).not.toHaveBeenCalled();
  });

  it("elimina correctamente un pedido confirmado", async () => {
    const user = userEvent.setup();

    mockObtenerPedidos
      .mockReturnValueOnce([PEDIDO])
      .mockReturnValueOnce([]);

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<AdminPedidos />);

    await user.click(
      screen.getByRole("button", {
        name: /eliminar/i,
      })
    );

    expect(
      mockEliminarPedido
    ).toHaveBeenCalledWith("PED-001");

    expect(
      screen.getByText(
        "Pedido eliminado correctamente."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "No existen pedidos registrados."
      )
    ).toBeInTheDocument();
  });

  it("muestra error si ocurre un problema al eliminar el pedido", async () => {
    const user = userEvent.setup();

    mockObtenerPedidos.mockReturnValue([PEDIDO]);

    vi.spyOn(window, "confirm").mockReturnValue(true);

    mockEliminarPedido.mockImplementation(() => {
      throw new Error("Pedido no encontrado");
    });

    render(<AdminPedidos />);

    await user.click(
      screen.getByRole("button", {
        name: /eliminar/i,
      })
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Pedido no encontrado");
  });
});
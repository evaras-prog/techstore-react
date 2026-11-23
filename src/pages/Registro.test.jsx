import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Registro from "./Registro";
import { ApiError } from "../data/apiClient";
import { regionesComunas } from "../data/regiones";

const { mockNavigate, mockRegistrar } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockRegistrar: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ registrar: mockRegistrar }),
}));

describe("Registro", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRegistrar.mockReset();
    mockRegistrar.mockResolvedValue({});
  });

  it("renderiza correctamente el formulario de registro", () => {
    render(<Registro />);

    expect(
      screen.getByRole("heading", { name: /crear cuenta/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("RUN")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Apellidos")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText("Región")).toBeInTheDocument();
    expect(screen.getByLabelText("Comuna")).toBeDisabled();
    expect(screen.getByLabelText("Dirección")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /registrarse/i })
    ).toBeInTheDocument();
  });

  it("muestra errores cuando se intenta registrar con campos vacíos", () => {
    render(<Registro />);

    const boton = screen.getByRole("button", {
      name: /registrarse/i,
    });

    fireEvent.submit(boton.closest("form"));

    expect(screen.getByText("Ingresa tu RUN.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tu nombre.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tus apellidos.")).toBeInTheDocument();
    expect(screen.getByText("Ingresa tu correo.")).toBeInTheDocument();
    expect(
      screen.getByText("Ingresa una contraseña.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Selecciona una región.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Selecciona una comuna.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ingresa tu dirección.")
    ).toBeInTheDocument();

    expect(mockRegistrar).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("muestra errores para RUN, correo y contraseña inválidos", async () => {
    const user = userEvent.setup();

    render(<Registro />);

    await user.type(screen.getByLabelText("RUN"), "123456789");
    await user.type(screen.getByLabelText("Nombre"), "Victor");
    await user.type(screen.getByLabelText("Apellidos"), "Cortez");
    await user.type(
      screen.getByLabelText("Correo"),
      "correo-invalido"
    );
    await user.type(screen.getByLabelText("Contraseña"), "123");

    const boton = screen.getByRole("button", {
      name: /registrarse/i,
    });

    fireEvent.submit(boton.closest("form"));

    expect(
      screen.getByText("Ingresa un RUN válido.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Ingresa un correo válido.")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "La contraseña debe tener entre 6 y 10 caracteres."
      )
    ).toBeInTheDocument();

    expect(mockRegistrar).not.toHaveBeenCalled();
  });

  it("habilita las comunas cuando se selecciona una región", async () => {
    const user = userEvent.setup();

    render(<Registro />);

    const primeraRegion = regionesComunas[0];

    const selectRegion = screen.getByLabelText("Región");
    const selectComuna = screen.getByLabelText("Comuna");

    expect(selectComuna).toBeDisabled();

    await user.selectOptions(
      selectRegion,
      primeraRegion.region
    );

    expect(selectComuna).not.toBeDisabled();

    primeraRegion.comunas.forEach((comuna) => {
      expect(
        screen.getByRole("option", { name: comuna })
      ).toBeInTheDocument();
    });
  });

  it("registra correctamente un cliente y entra al inicio", async () => {
    const user = userEvent.setup();

    render(<Registro />);

    const primeraRegion = regionesComunas[0];
    const primeraComuna = primeraRegion.comunas[0];

    await user.type(screen.getByLabelText("RUN"), "111111111");
    await user.type(screen.getByLabelText("Nombre"), "Victor");
    await user.type(screen.getByLabelText("Apellidos"), "Cortez");
    await user.type(screen.getByLabelText("Correo"), "victor@duoc.cl");
    await user.type(screen.getByLabelText("Contraseña"), "123456");

    await user.selectOptions(
        screen.getByLabelText("Región"),
        primeraRegion.region
    );
    await user.selectOptions(
        screen.getByLabelText("Comuna"),
        primeraComuna
    );
    await user.type(screen.getByLabelText("Dirección"), "Alameda 123");

    await user.click(
        screen.getByRole("button", { name: /registrarse/i })
    );

    await waitFor(() => {
      expect(mockRegistrar).toHaveBeenCalledWith({
        nombre: "Victor Cortez",
        correo: "victor@duoc.cl",
        password: "123456",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("muestra un mensaje cuando el correo ya está registrado", async () => {
    const user = userEvent.setup();

    mockRegistrar.mockRejectedValue(new ApiError(409, "Email ya registrado"));

    render(<Registro />);

    const primeraRegion = regionesComunas[0];
    const primeraComuna = primeraRegion.comunas[0];

    await user.type(screen.getByLabelText("RUN"), "111111111");
    await user.type(screen.getByLabelText("Nombre"), "Victor");
    await user.type(screen.getByLabelText("Apellidos"), "Cortez");
    await user.type(screen.getByLabelText("Correo"), "victor@duoc.cl");
    await user.type(screen.getByLabelText("Contraseña"), "123456");

    await user.selectOptions(
      screen.getByLabelText("Región"),
      primeraRegion.region
    );
    await user.selectOptions(
      screen.getByLabelText("Comuna"),
      primeraComuna
    );
    await user.type(screen.getByLabelText("Dirección"), "Alameda 123");

    await user.click(
      screen.getByRole("button", { name: /registrarse/i })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ya existe una cuenta con ese correo."
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Registro from "./Registro";
import { regionesComunas } from "../data/regiones";

const { mockNavigate, mockCrearUsuario } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockCrearUsuario: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../data/usuariosService", () => ({
  crearUsuario: mockCrearUsuario,
}));

describe("Registro", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    expect(mockCrearUsuario).not.toHaveBeenCalled();
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
        "La contraseña debe tener entre 4 y 10 caracteres."
      )
    ).toBeInTheDocument();

    expect(mockCrearUsuario).not.toHaveBeenCalled();
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

  it("registra correctamente un cliente y redirige al login", async () => {
    const user = userEvent.setup();

    render(<Registro />);

    const primeraRegion = regionesComunas[0];
    const primeraComuna = primeraRegion.comunas[0];

    await user.type(screen.getByLabelText("RUN"), "111111111");
    await user.type(screen.getByLabelText("Nombre"), "Victor");
    await user.type(screen.getByLabelText("Apellidos"), "Cortez");
    await user.type(
      screen.getByLabelText("Correo"),
      "victor@duoc.cl"
    );
    await user.type(screen.getByLabelText("Contraseña"), "1234");

    await user.selectOptions(
      screen.getByLabelText("Región"),
      primeraRegion.region
    );

    await user.selectOptions(
      screen.getByLabelText("Comuna"),
      primeraComuna
    );

    await user.type(
      screen.getByLabelText("Dirección"),
      "Alameda 123"
    );

    await user.click(
      screen.getByRole("button", { name: /registrarse/i })
    );

    expect(mockCrearUsuario).toHaveBeenCalledWith({
      run: "111111111",
      nombre: "Victor",
      apellidos: "Cortez",
      correo: "victor@duoc.cl",
      password: "1234",
      region: primeraRegion.region,
      comuna: primeraComuna,
      direccion: "Alameda 123",
      tipo: "Cliente",
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("muestra el error entregado por el servicio si no puede registrar", async () => {
    const user = userEvent.setup();

    mockCrearUsuario.mockImplementation(() => {
      throw new Error("El correo ya está registrado");
    });

    render(<Registro />);

    const primeraRegion = regionesComunas[0];
    const primeraComuna = primeraRegion.comunas[0];

    await user.type(screen.getByLabelText("RUN"), "111111111");
    await user.type(screen.getByLabelText("Nombre"), "Victor");
    await user.type(screen.getByLabelText("Apellidos"), "Cortez");
    await user.type(
      screen.getByLabelText("Correo"),
      "victor@duoc.cl"
    );
    await user.type(screen.getByLabelText("Contraseña"), "1234");

    await user.selectOptions(
      screen.getByLabelText("Región"),
      primeraRegion.region
    );

    await user.selectOptions(
      screen.getByLabelText("Comuna"),
      primeraComuna
    );

    await user.type(
      screen.getByLabelText("Dirección"),
      "Alameda 123"
    );

    await user.click(
      screen.getByRole("button", { name: /registrarse/i })
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("El correo ya está registrado");

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
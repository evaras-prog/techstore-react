import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import AdminUsuarios from "./AdminUsuarios";
import { regionesComunas } from "../../data/regiones";

const {
  mockObtenerUsuarios,
  mockCrearUsuario,
  mockActualizarUsuario,
  mockEliminarUsuario,
} = vi.hoisted(() => ({
  mockObtenerUsuarios: vi.fn(),
  mockCrearUsuario: vi.fn(),
  mockActualizarUsuario: vi.fn(),
  mockEliminarUsuario: vi.fn(),
}));

vi.mock("../../data/usuariosService", () => ({
  obtenerUsuarios: mockObtenerUsuarios,
  crearUsuario: mockCrearUsuario,
  actualizarUsuario: mockActualizarUsuario,
  eliminarUsuario: mockEliminarUsuario,
}));

const REGION = regionesComunas[0].region;
const COMUNA = regionesComunas[0].comunas[0];

const USUARIO = {
  run: "111111111",
  nombre: "Victor",
  apellidos: "Cortez",
  correo: "victor@duoc.cl",
  password: "1234",
  tipo: "Cliente",
  region: REGION,
  comuna: COMUNA,
  direccion: "Alameda 123",
};

function completarFormulario({
  run = "111111111",
  nombre = "Victor",
  apellidos = "Cortez",
  correo = "victor@duoc.cl",
  password = "1234",
  tipo = "Cliente",
  region = REGION,
  comuna = COMUNA,
  direccion = "Alameda 123",
} = {}) {
  fireEvent.change(
    screen.getByLabelText("RUN"),
    {
      target: { value: run },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Nombre"),
    {
      target: { value: nombre },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Apellidos"),
    {
      target: { value: apellidos },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Correo"),
    {
      target: { value: correo },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Contraseña"),
    {
      target: { value: password },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Tipo de usuario"),
    {
      target: { value: tipo },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Región"),
    {
      target: { value: region },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Comuna"),
    {
      target: { value: comuna },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Dirección"),
    {
      target: { value: direccion },
    }
  );
}

describe("AdminUsuarios", () => {
  beforeEach(() => {
    mockObtenerUsuarios.mockReset();
    mockCrearUsuario.mockReset();
    mockActualizarUsuario.mockReset();
    mockEliminarUsuario.mockReset();

    mockObtenerUsuarios.mockReturnValue([]);

    window.scrollTo = vi.fn();
    window.confirm = vi.fn(() => true);
  });

  it("renderiza el formulario y los usuarios registrados", () => {
    const administrador = {
      ...USUARIO,
      run: "222222222",
      nombre: "Admin",
      correo: "admin@duoc.cl",
      tipo: "Administrador",
    };

    const vendedor = {
      ...USUARIO,
      run: "333333333",
      nombre: "Vendedor",
      correo: "vendedor@duoc.cl",
      tipo: "Vendedor",
    };

    mockObtenerUsuarios.mockReturnValue([
      USUARIO,
      administrador,
      vendedor,
    ]);

    render(<AdminUsuarios />);

    expect(
      screen.getByRole("heading", {
        name: /gestión de usuarios/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /nuevo usuario/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Victor Cortez")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Cliente", {
        selector: ".badge.bg-primary",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Administrador", {
        selector: ".badge.bg-danger",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Vendedor", {
        selector: ".badge.bg-warning",
      })
    ).toBeInTheDocument();
  });

  it("habilita las comunas al seleccionar una región", () => {
    render(<AdminUsuarios />);

    const region = screen.getByLabelText("Región");
    const comuna = screen.getByLabelText("Comuna");

    expect(comuna).toBeDisabled();

    fireEvent.change(region, {
      target: { value: REGION },
    });

    expect(comuna).not.toBeDisabled();

    expect(
      screen.getByRole("option", {
        name: COMUNA,
      })
    ).toBeInTheDocument();
  });

  it("valida un RUN incorrecto", () => {
    render(<AdminUsuarios />);

    completarFormulario({
      run: "123456789",
    });

    fireEvent.submit(
      screen
        .getByRole("button", {
          name: /crear usuario/i,
        })
        .closest("form")
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Ingresa un RUN válido."
    );

    expect(
      mockCrearUsuario
    ).not.toHaveBeenCalled();
  });

  it("valida que el nombre sea obligatorio", () => {
    render(<AdminUsuarios />);

    completarFormulario({
      nombre: "   ",
    });

    fireEvent.submit(
      screen
        .getByRole("button", {
          name: /crear usuario/i,
        })
        .closest("form")
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Ingresa el nombre."
    );
  });

  it("valida que los apellidos sean obligatorios", () => {
    render(<AdminUsuarios />);

    completarFormulario({
      apellidos: "   ",
    });

    fireEvent.submit(
      screen
        .getByRole("button", {
          name: /crear usuario/i,
        })
        .closest("form")
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Ingresa los apellidos."
    );
  });

  it("valida un correo incorrecto", () => {
    render(<AdminUsuarios />);

    completarFormulario({
      correo: "correo-invalido",
    });

    fireEvent.submit(
      screen
        .getByRole("button", {
          name: /crear usuario/i,
        })
        .closest("form")
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Ingresa un correo válido."
    );
  });

  it("valida una contraseña incorrecta", () => {
    render(<AdminUsuarios />);

    completarFormulario({
      password: "123",
    });

    fireEvent.submit(
      screen
        .getByRole("button", {
          name: /crear usuario/i,
        })
        .closest("form")
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "La contraseña debe tener entre 4 y 10 caracteres."
    );
  });

  it("crea correctamente un usuario", () => {
    mockObtenerUsuarios
      .mockReturnValueOnce([])
      .mockReturnValueOnce([USUARIO]);

    render(<AdminUsuarios />);

    completarFormulario();

    fireEvent.submit(
      screen
        .getByRole("button", {
          name: /crear usuario/i,
        })
        .closest("form")
    );

    expect(
      mockCrearUsuario
    ).toHaveBeenCalledWith(USUARIO);

    expect(
      screen.getByText(
        "Usuario creado correctamente."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Victor Cortez")
    ).toBeInTheDocument();
  });

  it("muestra el error entregado por el servicio al crear", () => {
    mockCrearUsuario.mockImplementation(() => {
      throw new Error("El usuario ya existe");
    });

    render(<AdminUsuarios />);

    completarFormulario();

    fireEvent.submit(
      screen
        .getByRole("button", {
          name: /crear usuario/i,
        })
        .closest("form")
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "El usuario ya existe"
    );
  });

  it("carga los datos del usuario al editar", async () => {
    const user = userEvent.setup();

    mockObtenerUsuarios.mockReturnValue([
      USUARIO,
    ]);

    render(<AdminUsuarios />);

    await user.click(
      screen.getByRole("button", {
        name: /editar/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: /editar usuario 111111111/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("RUN")
    ).toBeDisabled();

    expect(
      screen.getByLabelText("Nombre")
    ).toHaveValue("Victor");

    expect(
      screen.getByLabelText("Correo")
    ).toHaveValue("victor@duoc.cl");

    expect(
      screen.getByLabelText("Tipo de usuario")
    ).toHaveValue("Cliente");

    expect(
      window.scrollTo
    ).toHaveBeenCalled();
  });

  it("actualiza correctamente un usuario", async () => {
    const user = userEvent.setup();

    const actualizado = {
      ...USUARIO,
      nombre: "Victor Manuel",
    };

    mockObtenerUsuarios
      .mockReturnValueOnce([USUARIO])
      .mockReturnValueOnce([actualizado]);

    render(<AdminUsuarios />);

    await user.click(
      screen.getByRole("button", {
        name: /editar/i,
      })
    );

    fireEvent.change(
      screen.getByLabelText("Nombre"),
      {
        target: {
          value: "Victor Manuel",
        },
      }
    );

    await user.click(
      screen.getByRole("button", {
        name: /guardar cambios/i,
      })
    );

    expect(
      mockActualizarUsuario
    ).toHaveBeenCalledWith(
      "111111111",
      actualizado
    );

    expect(
      screen.getByText(
        "Usuario actualizado correctamente."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Victor Manuel Cortez"
      )
    ).toBeInTheDocument();
  });

  it("cancela correctamente la edición", async () => {
    const user = userEvent.setup();

    mockObtenerUsuarios.mockReturnValue([
      USUARIO,
    ]);

    render(<AdminUsuarios />);

    await user.click(
      screen.getByRole("button", {
        name: /editar/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /cancelar/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: /nuevo usuario/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("RUN")
    ).not.toBeDisabled();

    expect(
      screen.getByLabelText("RUN")
    ).toHaveValue("");
  });

  it("no elimina al usuario si se cancela la confirmación", async () => {
    const user = userEvent.setup();

    mockObtenerUsuarios.mockReturnValue([
      USUARIO,
    ]);

    window.confirm = vi.fn(() => false);

    render(<AdminUsuarios />);

    await user.click(
      screen.getByRole("button", {
        name: /eliminar/i,
      })
    );

    expect(
      window.confirm
    ).toHaveBeenCalledWith(
      "¿Deseas eliminar al usuario Victor Cortez?"
    );

    expect(
      mockEliminarUsuario
    ).not.toHaveBeenCalled();
  });

  it("elimina correctamente un usuario", async () => {
    const user = userEvent.setup();

    mockObtenerUsuarios
      .mockReturnValueOnce([USUARIO])
      .mockReturnValueOnce([]);

    render(<AdminUsuarios />);

    await user.click(
      screen.getByRole("button", {
        name: /eliminar/i,
      })
    );

    expect(
      mockEliminarUsuario
    ).toHaveBeenCalledWith(
      "111111111"
    );

    expect(
      screen.getByText(
        "Usuario eliminado correctamente."
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Victor Cortez")
    ).not.toBeInTheDocument();
  });

  it("al eliminar al usuario que se estaba editando limpia el formulario", async () => {
    const user = userEvent.setup();

    mockObtenerUsuarios
      .mockReturnValueOnce([USUARIO])
      .mockReturnValueOnce([]);

    render(<AdminUsuarios />);

    await user.click(
      screen.getByRole("button", {
        name: /editar/i,
      })
    );

    expect(
      screen.getByLabelText("RUN")
    ).toBeDisabled();

    await user.click(
      screen.getByRole("button", {
        name: /eliminar/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: /nuevo usuario/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("RUN")
    ).toHaveValue("");
  });
});
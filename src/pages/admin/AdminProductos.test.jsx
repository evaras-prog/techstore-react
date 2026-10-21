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

import AdminProductos from "./AdminProductos";

const {
  mockObtenerProductos,
  mockCrearProducto,
  mockActualizarProducto,
  mockEliminarProducto,
} = vi.hoisted(() => ({
  mockObtenerProductos: vi.fn(),
  mockCrearProducto: vi.fn(),
  mockActualizarProducto: vi.fn(),
  mockEliminarProducto: vi.fn(),
}));

vi.mock("../../data/productosService", () => ({
  obtenerProductos: mockObtenerProductos,
  crearProducto: mockCrearProducto,
  actualizarProducto: mockActualizarProducto,
  eliminarProducto: mockEliminarProducto,
}));

const PRODUCTO = {
  codigo: "TEC001",
  nombre: "Notebook Gamer",
  descripcion: "Notebook para juegos",
  precio: 899990,
  stock: 2,
  stockCritico: 3,
  categoria: "Computadores",
  imagen: "/img/notebook.jpg",
  oferta: true,
  precioOferta: 799990,
};

function completarFormulario({
  codigo = "TEC007",
  nombre = "Mouse Gamer",
  descripcion = "Mouse RGB",
  precio = "29990",
  stock = "10",
  stockCritico = "2",
  categoria = "Accesorios",
  imagen = "/img/mouse.jpg",
} = {}) {
  fireEvent.change(
    screen.getByLabelText("Código"),
    {
      target: { value: codigo },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Nombre"),
    {
      target: { value: nombre },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Descripción"),
    {
      target: { value: descripcion },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Precio"),
    {
      target: { value: precio },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Stock"),
    {
      target: { value: stock },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Stock crítico"),
    {
      target: { value: stockCritico },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Categoría"),
    {
      target: { value: categoria },
    }
  );

  fireEvent.change(
    screen.getByLabelText("Ruta de imagen"),
    {
      target: { value: imagen },
    }
  );
}

describe("AdminProductos", () => {
  beforeEach(() => {
    mockObtenerProductos.mockReset();
    mockCrearProducto.mockReset();
    mockActualizarProducto.mockReset();
    mockEliminarProducto.mockReset();

    mockObtenerProductos.mockReturnValue([]);

    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("renderiza el formulario y la tabla de productos", () => {
    mockObtenerProductos.mockReturnValue([PRODUCTO]);

    render(<AdminProductos />);

    expect(
      screen.getByRole("heading", {
        name: /gestión de productos/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /nuevo producto/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("TEC001")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Notebook Gamer")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Computadores")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sí")
    ).toBeInTheDocument();

    expect(
      screen.getByText("2", {
        selector: ".badge.bg-danger",
      })
    ).toBeInTheDocument();
  });

  it("crea correctamente un producto", () => {
    const nuevoProducto = {
      codigo: "TEC007",
      nombre: "Mouse Gamer",
      descripcion: "Mouse RGB",
      precio: 29990,
      stock: 10,
      stockCritico: 2,
      categoria: "Accesorios",
      imagen: "/img/mouse.jpg",
      oferta: false,
      precioOferta: 0,
    };

    mockObtenerProductos
      .mockReturnValueOnce([])
      .mockReturnValueOnce([nuevoProducto]);

    render(<AdminProductos />);

    completarFormulario();

    const boton = screen.getByRole("button", {
      name: /crear producto/i,
    });

    fireEvent.submit(boton.closest("form"));

    expect(
      mockCrearProducto
    ).toHaveBeenCalledWith(nuevoProducto);

    expect(
      screen.getByText(
        "Producto creado correctamente."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Mouse Gamer")
    ).toBeInTheDocument();
  });

  it("valida que el precio sea mayor a cero", () => {
    render(<AdminProductos />);

    completarFormulario({
      precio: "0",
    });

    const boton = screen.getByRole("button", {
      name: /crear producto/i,
    });

    fireEvent.submit(boton.closest("form"));

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "El precio debe ser mayor a 0."
    );

    expect(
      mockCrearProducto
    ).not.toHaveBeenCalled();
  });

  it("valida que el stock no sea negativo", () => {
    render(<AdminProductos />);

    completarFormulario({
      stock: "-1",
    });

    const boton = screen.getByRole("button", {
      name: /crear producto/i,
    });

    fireEvent.submit(boton.closest("form"));

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "El stock no puede ser negativo."
    );

    expect(
      mockCrearProducto
    ).not.toHaveBeenCalled();
  });

  it("valida el precio cuando el producto está en oferta", async () => {
    const user = userEvent.setup();

    render(<AdminProductos />);

    completarFormulario();

    await user.click(
      screen.getByLabelText("Producto en oferta")
    );

    expect(
      screen.getByLabelText("Precio oferta")
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByLabelText("Precio oferta"),
      {
        target: { value: "0" },
      }
    );

    const boton = screen.getByRole("button", {
      name: /crear producto/i,
    });

    fireEvent.submit(boton.closest("form"));

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "Debes ingresar un precio de oferta válido."
    );

    expect(
      mockCrearProducto
    ).not.toHaveBeenCalled();
  });

  it("crea correctamente un producto en oferta", async () => {
    const user = userEvent.setup();

    const productoOferta = {
      codigo: "TEC007",
      nombre: "Mouse Gamer",
      descripcion: "Mouse RGB",
      precio: 29990,
      stock: 10,
      stockCritico: 2,
      categoria: "Accesorios",
      imagen: "/img/mouse.jpg",
      oferta: true,
      precioOferta: 19990,
    };

    mockObtenerProductos
      .mockReturnValueOnce([])
      .mockReturnValueOnce([productoOferta]);

    render(<AdminProductos />);

    completarFormulario();

    await user.click(
      screen.getByLabelText("Producto en oferta")
    );

    fireEvent.change(
      screen.getByLabelText("Precio oferta"),
      {
        target: { value: "19990" },
      }
    );

    const boton = screen.getByRole("button", {
      name: /crear producto/i,
    });

    fireEvent.submit(boton.closest("form"));

    expect(
      mockCrearProducto
    ).toHaveBeenCalledWith(productoOferta);
  });

  it("muestra un error si falla la creación del producto", () => {
    mockCrearProducto.mockImplementation(() => {
      throw new Error("El producto ya existe");
    });

    render(<AdminProductos />);

    completarFormulario();

    const boton = screen.getByRole("button", {
      name: /crear producto/i,
    });

    fireEvent.submit(boton.closest("form"));

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      "El producto ya existe"
    );
  });

  it("carga los datos de un producto al editar", async () => {
    const user = userEvent.setup();

    mockObtenerProductos.mockReturnValue([PRODUCTO]);

    render(<AdminProductos />);

    await user.click(
      screen.getByRole("button", {
        name: /editar/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: /editar producto TEC001/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Código")
    ).toBeDisabled();

    expect(
      screen.getByLabelText("Código")
    ).toHaveValue("TEC001");

    expect(
      screen.getByLabelText("Nombre")
    ).toHaveValue("Notebook Gamer");

    expect(
      screen.getByLabelText("Producto en oferta")
    ).toBeChecked();

    expect(
      screen.getByLabelText("Precio oferta")
    ).toHaveValue(799990);

    expect(
      window.scrollTo
    ).toHaveBeenCalled();
  });

  it("actualiza correctamente un producto", async () => {
    const user = userEvent.setup();

    const productoActualizado = {
      ...PRODUCTO,
      nombre: "Notebook Gamer Pro",
    };

    mockObtenerProductos
      .mockReturnValueOnce([PRODUCTO])
      .mockReturnValueOnce([productoActualizado]);

    render(<AdminProductos />);

    await user.click(
      screen.getByRole("button", {
        name: /editar/i,
      })
    );

    fireEvent.change(
      screen.getByLabelText("Nombre"),
      {
        target: {
          value: "Notebook Gamer Pro",
        },
      }
    );

    await user.click(
      screen.getByRole("button", {
        name: /guardar cambios/i,
      })
    );

    expect(
      mockActualizarProducto
    ).toHaveBeenCalledWith(
      "TEC001",
      productoActualizado
    );

    expect(
      screen.getByText(
        "Producto actualizado correctamente."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Notebook Gamer Pro")
    ).toBeInTheDocument();
  });

  it("cancela correctamente la edición", async () => {
    const user = userEvent.setup();

    mockObtenerProductos.mockReturnValue([PRODUCTO]);

    render(<AdminProductos />);

    await user.click(
      screen.getByRole("button", {
        name: /editar/i,
      })
    );

    expect(
      screen.getByRole("button", {
        name: /cancelar/i,
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /cancelar/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: /nuevo producto/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Código")
    ).not.toBeDisabled();

    expect(
      screen.getByLabelText("Código")
    ).toHaveValue("");
  });

  it("no elimina un producto si se cancela la confirmación", async () => {
    const user = userEvent.setup();

    mockObtenerProductos.mockReturnValue([PRODUCTO]);

    window.confirm.mockReturnValue(false);

    render(<AdminProductos />);

    await user.click(
      screen.getByRole("button", {
        name: /eliminar/i,
      })
    );

    expect(
      window.confirm
    ).toHaveBeenCalledWith(
      "¿Deseas eliminar el producto Notebook Gamer?"
    );

    expect(
      mockEliminarProducto
    ).not.toHaveBeenCalled();
  });

  it("elimina correctamente un producto confirmado", async () => {
    const user = userEvent.setup();

    mockObtenerProductos
      .mockReturnValueOnce([PRODUCTO])
      .mockReturnValueOnce([]);

    window.confirm.mockReturnValue(true);

    render(<AdminProductos />);

    await user.click(
      screen.getByRole("button", {
        name: /eliminar/i,
      })
    );

    expect(
      mockEliminarProducto
    ).toHaveBeenCalledWith("TEC001");

    expect(
      screen.getByText(
        "Producto eliminado correctamente."
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Notebook Gamer")
    ).not.toBeInTheDocument();
  });

  it("al eliminar el producto que se estaba editando limpia el formulario", async () => {
    const user = userEvent.setup();

    mockObtenerProductos
      .mockReturnValueOnce([PRODUCTO])
      .mockReturnValueOnce([]);

    window.confirm.mockReturnValue(true);

    render(<AdminProductos />);

    await user.click(
      screen.getByRole("button", {
        name: /editar/i,
      })
    );

    expect(
      screen.getByLabelText("Código")
    ).toBeDisabled();

    await user.click(
      screen.getByRole("button", {
        name: /eliminar/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: /nuevo producto/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Código")
    ).toHaveValue("");
  });
});
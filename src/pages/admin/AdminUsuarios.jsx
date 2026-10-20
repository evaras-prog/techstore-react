import { useState } from "react";

import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../../data/usuariosService";

import {
  validarRun,
  validarCorreo,
  validarPassword,
} from "../../data/validaciones";

import {
  regionesComunas,
  obtenerComunas,
} from "../../data/regiones";

const USUARIO_INICIAL = {
  run: "",
  nombre: "",
  apellidos: "",
  correo: "",
  password: "",
  tipo: "Cliente",
  region: "",
  comuna: "",
  direccion: "",
};

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(
    () => obtenerUsuarios()
  );

  const [formulario, setFormulario] = useState(
    USUARIO_INICIAL
  );

  const [runEdicion, setRunEdicion] = useState(null);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  function handleRegionChange(event) {
    const region = event.target.value;

    setFormulario((actual) => ({
      ...actual,
      region,
      comuna: "",
    }));
  }

  function handleEditar(usuario) {
    setFormulario({
      run: usuario.run,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      password: usuario.password,
      tipo: usuario.tipo,
      region: usuario.region,
      comuna: usuario.comuna,
      direccion: usuario.direccion,
    });

    setRunEdicion(usuario.run);

    setError("");
    setMensaje("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelarEdicion() {
    setRunEdicion(null);
    setFormulario(USUARIO_INICIAL);
    setError("");
    setMensaje("");
  }

  function handleEliminar(usuario) {
    const confirmar = window.confirm(
      `¿Deseas eliminar al usuario ${usuario.nombre} ${usuario.apellidos}?`
    );

    if (!confirmar) {
      return;
    }

    eliminarUsuario(usuario.run);

    setUsuarios(obtenerUsuarios());

    if (runEdicion === usuario.run) {
      setRunEdicion(null);
      setFormulario(USUARIO_INICIAL);
    }

    setError("");
    setMensaje("Usuario eliminado correctamente.");
  }

  function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMensaje("");

    const usuario = {
      run: formulario.run.trim(),
      nombre: formulario.nombre.trim(),
      apellidos: formulario.apellidos.trim(),
      correo: formulario.correo.trim(),
      password: formulario.password,
      tipo: formulario.tipo,
      region: formulario.region,
      comuna: formulario.comuna,
      direccion: formulario.direccion.trim(),
    };

    if (!validarRun(usuario.run)) {
      setError("Ingresa un RUN válido.");
      return;
    }

    if (!usuario.nombre) {
      setError("Ingresa el nombre.");
      return;
    }

    if (!usuario.apellidos) {
      setError("Ingresa los apellidos.");
      return;
    }

    if (!validarCorreo(usuario.correo)) {
      setError("Ingresa un correo válido.");
      return;
    }

    if (!validarPassword(usuario.password)) {
      setError(
        "La contraseña debe tener entre 4 y 10 caracteres."
      );
      return;
    }

    if (!usuario.region) {
      setError("Selecciona una región.");
      return;
    }

    if (!usuario.comuna) {
      setError("Selecciona una comuna.");
      return;
    }

    if (!usuario.direccion) {
      setError("Ingresa una dirección.");
      return;
    }

    try {
      if (runEdicion) {
        actualizarUsuario(
          runEdicion,
          usuario
        );

        setMensaje(
          "Usuario actualizado correctamente."
        );
      } else {
        crearUsuario(usuario);

        setMensaje(
          "Usuario creado correctamente."
        );
      }

      setUsuarios(obtenerUsuarios());

      setFormulario(USUARIO_INICIAL);

      setRunEdicion(null);

    } catch (error) {
      setError(error.message);
    }
  }

  const comunasDisponibles =
    obtenerComunas(formulario.region);

  return (
    <div>

      <h2 className="mb-3">
        Gestión de usuarios
      </h2>

      <p className="text-muted">
        Administración de usuarios de TechStore.
      </p>

      <div className="card mb-4">

        <div className="card-body">

          <h3 className="h5 mb-3">
            {runEdicion
              ? `Editar usuario ${runEdicion}`
              : "Nuevo usuario"}
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-12 col-md-4 mb-3">

                <label
                  htmlFor="run"
                  className="form-label"
                >
                  RUN
                </label>

                <input
                  id="run"
                  name="run"
                  className="form-control"
                  value={formulario.run}
                  onChange={handleChange}
                  placeholder="123456785"
                  disabled={runEdicion !== null}
                  required
                />

              </div>

              <div className="col-12 col-md-4 mb-3">

                <label
                  htmlFor="nombre"
                  className="form-label"
                >
                  Nombre
                </label>

                <input
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-12 col-md-4 mb-3">

                <label
                  htmlFor="apellidos"
                  className="form-label"
                >
                  Apellidos
                </label>

                <input
                  id="apellidos"
                  name="apellidos"
                  className="form-control"
                  value={formulario.apellidos}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-12 col-md-6 mb-3">

                <label
                  htmlFor="correo"
                  className="form-label"
                >
                  Correo
                </label>

                <input
                  id="correo"
                  name="correo"
                  type="email"
                  className="form-control"
                  value={formulario.correo}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-12 col-md-6 mb-3">

                <label
                  htmlFor="password"
                  className="form-label"
                >
                  Contraseña
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  value={formulario.password}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-12 col-md-4 mb-3">

                <label
                  htmlFor="tipo"
                  className="form-label"
                >
                  Tipo de usuario
                </label>

                <select
                  id="tipo"
                  name="tipo"
                  className="form-select"
                  value={formulario.tipo}
                  onChange={handleChange}
                >
                  <option value="Cliente">
                    Cliente
                  </option>

                  <option value="Vendedor">
                    Vendedor
                  </option>

                  <option value="Administrador">
                    Administrador
                  </option>
                </select>

              </div>

              <div className="col-12 col-md-4 mb-3">

                <label
                  htmlFor="region"
                  className="form-label"
                >
                  Región
                </label>

                <select
                  id="region"
                  name="region"
                  className="form-select"
                  value={formulario.region}
                  onChange={handleRegionChange}
                  required
                >
                  <option value="">
                    Seleccione una región
                  </option>

                  {regionesComunas.map((item) => (
                    <option
                      key={item.region}
                      value={item.region}
                    >
                      {item.region}
                    </option>
                  ))}
                </select>

              </div>

              <div className="col-12 col-md-4 mb-3">

                <label
                  htmlFor="comuna"
                  className="form-label"
                >
                  Comuna
                </label>

                <select
                  id="comuna"
                  name="comuna"
                  className="form-select"
                  value={formulario.comuna}
                  onChange={handleChange}
                  disabled={!formulario.region}
                  required
                >
                  <option value="">
                    Seleccione una comuna
                  </option>

                  {comunasDisponibles.map((comuna) => (
                    <option
                      key={comuna}
                      value={comuna}
                    >
                      {comuna}
                    </option>
                  ))}
                </select>

              </div>

              <div className="col-12 mb-3">

                <label
                  htmlFor="direccion"
                  className="form-label"
                >
                  Dirección
                </label>

                <input
                  id="direccion"
                  name="direccion"
                  className="form-control"
                  value={formulario.direccion}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {error && (
              <div
                className="alert alert-danger"
                role="alert"
              >
                {error}
              </div>
            )}

            {mensaje && (
              <div
                className="alert alert-success"
                role="alert"
              >
                {mensaje}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
            >
              {runEdicion
                ? "Guardar cambios"
                : "Crear usuario"}
            </button>

            {runEdicion && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={handleCancelarEdicion}
              >
                Cancelar
              </button>
            )}

          </form>

        </div>

      </div>

      <div className="table-responsive">

        <table className="table table-striped table-hover align-middle">

          <thead className="table-dark">

            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo</th>
              <th>Región</th>
              <th>Comuna</th>
              <th>Acciones</th>
            </tr>

          </thead>

          <tbody>

            {usuarios.map((usuario) => (

              <tr key={usuario.run}>

                <td>
                  {usuario.run}
                </td>

                <td>
                  {usuario.nombre}{" "}
                  {usuario.apellidos}
                </td>

                <td>
                  {usuario.correo}
                </td>

                <td>

                  <span
                    className={`badge ${
                      usuario.tipo === "Administrador"
                        ? "bg-danger"
                        : usuario.tipo === "Vendedor"
                        ? "bg-warning text-dark"
                        : "bg-primary"
                    }`}
                  >
                    {usuario.tipo}
                  </span>

                </td>

                <td>
                  {usuario.region}
                </td>

                <td>
                  {usuario.comuna}
                </td>

                <td>

                  <div className="d-flex gap-2">

                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        handleEditar(usuario)
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleEliminar(usuario)
                      }
                    >
                      Eliminar
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminUsuarios;
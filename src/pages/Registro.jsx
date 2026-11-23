import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CampoFormulario from "../components/CampoFormulario";

import {
  validarCorreo,
  validarRun,
} from "../data/validaciones";

import { useAuth } from "../context/AuthContext";
import { ApiError } from "../data/apiClient";

import {
  regionesComunas,
  obtenerComunas,
} from "../data/regiones";

function Registro() {
  const navigate = useNavigate();
  const { registrar } = useAuth();

  const [datos, setDatos] = useState({
    run: "",
    nombre: "",
    apellidos: "",
    correo: "",
    password: "",
    region: "",
    comuna: "",
    direccion: "",
  });

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setDatos((actual) => ({
      ...actual,
      [name]: value,
    }));

    setErrores((actual) => ({
      ...actual,
      [name]: "",
    }));
  }

  function handleRegionChange(event) {
    const region = event.target.value;

    setDatos((actual) => ({
      ...actual,
      region,
      comuna: "",
    }));

    setErrores((actual) => ({
      ...actual,
      region: "",
      comuna: "",
    }));
  }

  function validarFormulario() {
    const nuevosErrores = {};

    if (!datos.run.trim()) {
      nuevosErrores.run = "Ingresa tu RUN.";
    } else if (!validarRun(datos.run)) {
      nuevosErrores.run = "Ingresa un RUN válido.";
    }

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = "Ingresa tu nombre.";
    }

    if (!datos.apellidos.trim()) {
      nuevosErrores.apellidos = "Ingresa tus apellidos.";
    }

    if (!datos.correo.trim()) {
      nuevosErrores.correo = "Ingresa tu correo.";
    } else if (!validarCorreo(datos.correo)) {
      nuevosErrores.correo = "Ingresa un correo válido.";
    }

    if (!datos.password) {
      nuevosErrores.password = "Ingresa una contraseña.";
    } else if (datos.password.length < 6 || datos.password.length > 10) {
      nuevosErrores.password =
          "La contraseña debe tener entre 6 y 10 caracteres.";
    }

    if (!datos.region) {
      nuevosErrores.region = "Selecciona una región.";
    }

    if (!datos.comuna) {
      nuevosErrores.comuna = "Selecciona una comuna.";
    }

    if (!datos.direccion.trim()) {
      nuevosErrores.direccion = "Ingresa tu dirección.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorGeneral("");

    if (!validarFormulario()) {
      return;
    }

    try {
      await registrar({
        nombre: `${datos.nombre.trim()} ${datos.apellidos.trim()}`,
        correo: datos.correo.trim(),
        password: datos.password,
      });
      navigate("/");
    } catch (e) {
      if (e instanceof ApiError && e.estado === 409) {
        setErrorGeneral("Ya existe una cuenta con ese correo.");
      } else if (e instanceof ApiError) {
        setErrorGeneral(Object.values(e.detalles ?? {})[0] ?? e.message);
      } else {
        setErrorGeneral("No se pudo conectar con el servidor.");
      }
    }
  }

  const comunasDisponibles = obtenerComunas(datos.region);

  return (
    <div className="container py-4">
      <div className="row justify-content-center">

        <div className="col-12 col-md-8 col-lg-6">

          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h1 className="h3 mb-4 text-center">
                Crear cuenta
              </h1>

              <form onSubmit={handleSubmit}>

                <CampoFormulario
                  label="RUN"
                  name="run"
                  value={datos.run}
                  onChange={handleChange}
                  error={errores.run}
                  placeholder="Ej: 111111111"
                />

                <CampoFormulario
                  label="Nombre"
                  name="nombre"
                  value={datos.nombre}
                  onChange={handleChange}
                  error={errores.nombre}
                  placeholder="Ingrese su nombre"
                />

                <CampoFormulario
                  label="Apellidos"
                  name="apellidos"
                  value={datos.apellidos}
                  onChange={handleChange}
                  error={errores.apellidos}
                  placeholder="Ingrese sus apellidos"
                />

                <CampoFormulario
                  label="Correo"
                  name="correo"
                  type="email"
                  value={datos.correo}
                  onChange={handleChange}
                  error={errores.correo}
                  placeholder="correo@ejemplo.cl"
                />

                <CampoFormulario
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={datos.password}
                  onChange={handleChange}
                  error={errores.password}
                  placeholder="6 a 10 caracteres"
                />

                <div className="mb-3">
                  <label
                    htmlFor="region"
                    className="form-label"
                  >
                    Región
                  </label>

                  <select
                    id="region"
                    name="region"
                    className={`form-select ${
                      errores.region ? "is-invalid" : ""
                    }`}
                    value={datos.region}
                    onChange={handleRegionChange}
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

                  {errores.region && (
                    <div className="invalid-feedback">
                      {errores.region}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="comuna"
                    className="form-label"
                  >
                    Comuna
                  </label>

                  <select
                    id="comuna"
                    name="comuna"
                    className={`form-select ${
                      errores.comuna ? "is-invalid" : ""
                    }`}
                    value={datos.comuna}
                    onChange={handleChange}
                    disabled={!datos.region}
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

                  {errores.comuna && (
                    <div className="invalid-feedback">
                      {errores.comuna}
                    </div>
                  )}
                </div>

                <CampoFormulario
                  label="Dirección"
                  name="direccion"
                  value={datos.direccion}
                  onChange={handleChange}
                  error={errores.direccion}
                  placeholder="Ingrese su dirección"
                />

                {errorGeneral && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    {errorGeneral}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Registrarse
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Registro;
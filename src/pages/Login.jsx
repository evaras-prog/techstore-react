import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CampoFormulario from "../components/CampoFormulario";
import { useAuth } from "../context/AuthContext";
import { buscarPorCorreo } from "../data/usuariosService";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const usuario = buscarPorCorreo(correo.trim());

    if (!usuario || usuario.password !== password) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    login(usuario);

    navigate("/");
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">

        <div className="col-12 col-md-6 col-lg-5">

          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h1 className="h3 mb-4 text-center">
                Iniciar sesión
              </h1>

              <form onSubmit={handleSubmit}>

                <CampoFormulario
                  label="Correo"
                  name="correo"
                  type="email"
                  value={correo}
                  onChange={(event) =>
                    setCorreo(event.target.value)
                  }
                  placeholder="Ingrese su correo"
                />

                <CampoFormulario
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Ingrese su contraseña"
                />

                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Ingresar
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
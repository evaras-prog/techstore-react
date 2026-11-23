import { createContext, useContext, useEffect, useState } from "react";
import { api, guardarToken, borrarToken, obtenerToken } from "../data/apiClient";

const AuthContext = createContext(null);

const CLAVE_USUARIO = "usuarioActivo";

const TIPOS = {
    ADMIN: "Administrador",
    VENDEDOR: "Vendedor",
    CLIENTE: "Cliente",
};

// Convierte la respuesta de la API al usuario que usa el resto de la app.
function aUsuario(respuesta) {
    return {
        nombre: respuesta.nombre,
        correo: respuesta.email,
        rol: respuesta.rol,
        tipo: TIPOS[respuesta.rol],
    };
}

function guardarSesion(respuesta) {
    const usuario = aUsuario(respuesta);
    guardarToken(respuesta.token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    return usuario;
}

function limpiarSesion() {
    borrarToken();
    localStorage.removeItem(CLAVE_USUARIO);
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem(CLAVE_USUARIO);
        return guardado && obtenerToken() ? JSON.parse(guardado) : null;
    });

    // Al cargar la app: si hay token, se verifica y renueva con /auth/refresh.
    useEffect(() => {
        if (!obtenerToken()) {
            return;
        }
        api("/auth/refresh", { metodo: "POST" })
            .then((respuesta) => {
                if (obtenerToken()) {
                    setUsuario(guardarSesion(respuesta));
                }
            })
            .catch(() => {
                limpiarSesion();
                setUsuario(null);
            });
    }, []);

    const login = async (correo, password) => {
        const respuesta = await api("/auth/login", {
            metodo: "POST",
            cuerpo: { email: correo, password },
        });
        const nuevo = guardarSesion(respuesta);
        setUsuario(nuevo);
        return nuevo;
    };

    const registrar = async ({ nombre, correo, password }) => {
        const respuesta = await api("/auth/registro", {
            metodo: "POST",
            cuerpo: { nombre, email: correo, password },
        });
        const nuevo = guardarSesion(respuesta);
        setUsuario(nuevo);
        return nuevo;
    };

    const logout = () => {
        limpiarSesion();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, registrar, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}
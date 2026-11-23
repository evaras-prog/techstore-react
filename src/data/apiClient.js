const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";
const CLAVE_TOKEN = "token";

export function obtenerToken() {
    return localStorage.getItem(CLAVE_TOKEN);
}

export function guardarToken(token) {
    localStorage.setItem(CLAVE_TOKEN, token);
}

export function borrarToken() {
    localStorage.removeItem(CLAVE_TOKEN);
}

export class ApiError extends Error {
    constructor(estado, mensaje, detalles) {
        super(mensaje);
        this.estado = estado;
        this.detalles = detalles;
    }
}

export async function api(ruta, { metodo = "GET", cuerpo } = {}) {
    const headers = {};
    if (cuerpo !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    const token = obtenerToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const respuesta = await fetch(`${API_URL}${ruta}`, {
        method: metodo,
        headers,
        body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });

    if (respuesta.status === 204) {
        return null;
    }

    const datos = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        throw new ApiError(
            respuesta.status,
            datos?.mensaje ?? "Error inesperado del servidor",
            datos?.detalles
        );
    }
    return datos;
}
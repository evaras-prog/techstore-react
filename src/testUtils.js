import { vi } from "vitest";

const ROLES = {
    Administrador: "ADMIN",
    Vendedor: "VENDEDOR",
    Cliente: "CLIENTE",
};

// Simula la respuesta de fetch con el cuerpo y el estado indicados.
export function simularApi(datos, estado = 200) {
    const fetchFalso = vi.fn(async () => ({
        ok: estado < 400,
        status: estado,
        json: async () => datos,
    }));
    vi.stubGlobal("fetch", fetchFalso);
    return fetchFalso;
}

// Deja una sesión iniciada: token + usuario guardados y /auth/refresh simulado.
export function sembrarSesion(usuario) {
    localStorage.setItem("token", "token-de-prueba");
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    simularApi({
        token: "token-renovado",
        nombre: usuario.nombre,
        email: usuario.correo ?? "",
        rol: ROLES[usuario.tipo],
    });
}
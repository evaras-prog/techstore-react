import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem('usuarioActivo');
        return guardado ? JSON.parse(guardado) : null;
    });
    
    const login = (datosUsuario) => {
        setUsuario(datosUsuario);
        localStorage.setItem('usuarioActivo', JSON.stringify(datosUsuario));
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('usuarioActivo');
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}
import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  const guardar = (nuevosItems) => {
    setItems(nuevosItems);
    localStorage.setItem('carrito', JSON.stringify(nuevosItems));
  };

  const agregar = (producto) => {
    const existente = items.find((i) => i.codigo === producto.codigo);
    if (existente) {
      guardar(
        items.map((i) =>
          i.codigo === producto.codigo ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      );
    } else {
      guardar([...items, { ...producto, cantidad: 1 }]);
    }
  };

  const quitar = (codigo) => {
    guardar(items.filter((i) => i.codigo !== codigo));
  };

  const vaciar = () => {
    guardar([]);
  };

  const total = items.reduce((suma, i) => {
    const precio = i.oferta ? i.precioOferta : i.precio;
    return suma + precio * i.cantidad;
  }, 0);

  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ items, agregar, quitar, vaciar, total, cantidadTotal }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
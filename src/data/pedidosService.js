const CLAVE = "pedidosAdmin";

function leer() {
  const guardado = localStorage.getItem(CLAVE);

  return guardado
    ? JSON.parse(guardado)
    : [];
}

function escribir(lista) {
  localStorage.setItem(
    CLAVE,
    JSON.stringify(lista)
  );
}

export function obtenerPedidos() {
  return leer();
}

export function crearPedido(datos) {
  const pedido = {
    ...datos,
    id: `PED-${Date.now()}`,
    fecha: new Date()
      .toISOString()
      .slice(0, 10),
    estado: "Pagado",
  };

  escribir([
    ...leer(),
    pedido,
  ]);

  return pedido;
}

export function actualizarEstadoPedido(
  id,
  nuevoEstado
) {
  const lista = leer();

  const indice = lista.findIndex(
    (pedido) => pedido.id === id
  );

  if (indice === -1) {
    throw new Error(
      "Pedido no encontrado"
    );
  }

  lista[indice] = {
    ...lista[indice],
    estado: nuevoEstado,
  };

  escribir(lista);

  return lista[indice];
}

export function eliminarPedido(id) {
  const lista = leer();

  const existe = lista.some(
    (pedido) => pedido.id === id
  );

  if (!existe) {
    throw new Error(
      "Pedido no encontrado"
    );
  }

  escribir(
    lista.filter(
      (pedido) => pedido.id !== id
    )
  );
}
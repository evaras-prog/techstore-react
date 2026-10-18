const CLAVE = 'pedidosAdmin';

function leer() {
  const guardado = localStorage.getItem(CLAVE);
  return guardado ? JSON.parse(guardado) : [];
}

function escribir(lista) {
  localStorage.setItem(CLAVE, JSON.stringify(lista));
}

export function obtenerPedidos() {
  return leer();
}

export function crearPedido(datos) {
  const pedido = {
    ...datos,
    id: `PED-${Date.now()}`,
    fecha: new Date().toISOString().slice(0, 10),
    estado: 'Pagado',
  };
  escribir([...leer(), pedido]);
  return pedido;
}
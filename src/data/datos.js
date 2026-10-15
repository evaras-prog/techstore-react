export const PRODUCTOS_BASE = [
  {
    codigo: 'TEC001', nombre: 'Laptop Ultrabook Pro',
    descripcion: 'Notebook liviano para estudio, desarrollo y productividad. Intel Core i7, 16 GB RAM y SSD 512 GB.',
    precio: 899990, stock: 8, stockCritico: 3, categoria: 'Computación',
    imagen: '/img/laptop.svg', oferta: false, precioOferta: 0,
  },
  {
    codigo: 'TEC002', nombre: 'Smartphone Galaxy X',
    descripcion: 'Smartphone 5G con pantalla AMOLED de 6.7 pulgadas y 128 GB de almacenamiento.',
    precio: 499990, stock: 12, stockCritico: 4, categoria: 'Telefonía',
    imagen: '/img/smartphone.svg', oferta: false, precioOferta: 0,
  },
  {
    codigo: 'TEC003', nombre: 'Audífonos Noise Pro',
    descripcion: 'Audífonos Bluetooth con cancelación activa de ruido y autonomía aproximada de 30 horas.',
    precio: 129990, stock: 4, stockCritico: 5, categoria: 'Accesorios',
    imagen: '/img/audifonos.svg', oferta: true, precioOferta: 99990,
  },
  {
    codigo: 'TEC004', nombre: 'Tablet ProPad 11',
    descripcion: 'Tablet de 11 pulgadas, 256 GB, WiFi 6 y compatibilidad con stylus.',
    precio: 349990, stock: 6, stockCritico: 2, categoria: 'Tablets',
    imagen: '/img/tablet.svg', oferta: false, precioOferta: 0,
  },
  {
    codigo: 'TEC005', nombre: 'Monitor Vision 27',
    descripcion: 'Monitor IPS Full HD de 27 pulgadas, 100 Hz y diseño de bordes delgados.',
    precio: 189990, stock: 7, stockCritico: 2, categoria: 'Monitores',
    imagen: '/img/monitor.svg', oferta: false, precioOferta: 0,
  },
  {
    codigo: 'TEC006', nombre: 'Teclado Mechanical K',
    descripcion: 'Teclado mecánico RGB con switches táctiles y conexión USB-C.',
    precio: 79990, stock: 15, stockCritico: 5, categoria: 'Accesorios',
    imagen: '/img/teclado.svg', oferta: true, precioOferta: 59990,
  },
];

export const USUARIOS_BASE = [
  {
    run: '111111111', nombre: 'Admin', apellidos: 'TechStore',
    correo: 'admin@duoc.cl', password: '1234', tipo: 'Administrador',
    region: 'Región Metropolitana de Santiago', comuna: 'Santiago',
    direccion: 'Av. Providencia 1234',
  },
  {
    run: '222222222', nombre: 'Vendedor', apellidos: 'TechStore',
    correo: 'vendedor@duoc.cl', password: '1234', tipo: 'Vendedor',
    region: 'Región Metropolitana de Santiago', comuna: 'Santiago',
    direccion: 'Av. Providencia 1234',
  },
  {
    run: '333333333', nombre: 'Cliente', apellidos: 'Demo',
    correo: 'cliente@gmail.com', password: '1234', tipo: 'Cliente',
    region: 'Región Metropolitana de Santiago', comuna: 'Santiago',
    direccion: 'Av. Providencia 1234',
  },
];

export function formatoCLP(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);
}
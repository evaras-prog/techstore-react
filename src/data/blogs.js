export const ARTICULOS = [
  {
    id: 'laptops-2025',
    categoria: 'Computadores',
    titulo: 'Las mejores laptops del 2025 para estudiantes',
    fecha: '15 agosto 2025',
    autor: 'Equipo TechStore',
    imagen: '/img/blog1.jpg',
    resumen:
      'Descubre cuáles son los modelos más recomendados este año según rendimiento, batería y precio.',
    introduccion:
      'Elegir una laptop para estudiar no es fácil. Hay cientos de modelos, rangos de precio y especificaciones técnicas que pueden confundir a cualquiera. En TechStore seleccionamos los tres mejores modelos del 2025 según rendimiento, duración de batería y precio.',
    secciones: [
      {
        titulo: '1. Laptop Ultrabook Pro — La más equilibrada',
        texto:
          'Con su procesador Intel Core i7 y 16GB de RAM, la Ultrabook Pro maneja sin problemas todas las aplicaciones universitarias: desde editores de código hasta software de diseño. Su batería dura hasta 12 horas en uso normal.',
      },
      {
        titulo: '2. Laptop SlimBook Air — La más liviana',
        texto:
          'Solo 1.2kg de peso la convierten en la opción ideal para estudiantes que se mueven mucho. Pantalla Full HD de 13.3" y procesador AMD Ryzen 5. Perfecta para tomar apuntes y navegar.',
      },
      {
        titulo: '3. Laptop WorkStation 15 — La más potente',
        texto:
          'Para estudiantes de ingeniería o diseño que necesitan más músculo: procesador Intel Core i9, 32GB RAM y GPU dedicada NVIDIA RTX 3050. Ideal para renderizado 3D y máquinas virtuales.',
      },
    ],
    conclusion:
      'Si buscas equilibrio entre precio y rendimiento, la Ultrabook Pro es nuestra recomendación número uno para el año académico 2025.',
  },
  {
    id: 'smartphones-5g',
    categoria: 'Smartphones',
    titulo: '¿Vale la pena pasarse al 5G en Chile?',
    fecha: '28 julio 2025',
    autor: 'Equipo TechStore',
    imagen: '/img/blog2.jpg',
    resumen:
      'Analizamos la cobertura actual, los precios de los equipos y si realmente notarás la diferencia.',
    introduccion:
      'El 5G llegó a Chile hace algunos años, pero recién en 2025 la cobertura se ha extendido lo suficiente como para que sea una pregunta válida: ¿deberías cambiar tu smartphone por uno compatible con esta tecnología?',
    secciones: [
      {
        titulo: '¿Qué tan buena es la cobertura 5G en Chile?',
        texto:
          'Actualmente Entel, Movistar y WOM ofrecen cobertura 5G principalmente en Santiago, Valparaíso y Concepción. Si vives en estas ciudades y te mueves por zonas céntricas, es probable que ya tengas señal 5G disponible.',
      },
      {
        titulo: '¿Cuánto más rápido es realmente?',
        texto:
          'En condiciones ideales, el 5G puede alcanzar velocidades de descarga entre 300 y 1000 Mbps, frente a los 50–150 Mbps típicos del 4G LTE. En la práctica, la diferencia es notable al descargar archivos grandes o hacer streaming en 4K.',
      },
      {
        titulo: '¿Cuánto cuesta un smartphone 5G?',
        texto:
          'En TechStore contamos con opciones desde $299.990 para smartphones 5G de gama media. Ya no es necesario gastar un millón de pesos para acceder a esta tecnología.',
      },
    ],
    conclusion:
      'Si vives en una ciudad con cobertura 5G y estás pensando en cambiar de teléfono de todas formas, sí vale la pena optar por un modelo 5G. La diferencia de precio es mínima y la tecnología te durará más años.',
  },
];

export function obtenerArticulos() {
  return ARTICULOS;
}

export function obtenerArticuloPorId(id) {
  return ARTICULOS.find((a) => a.id === id) || null;
}
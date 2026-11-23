# TechStore

Tienda online de productos tecnológicos, desarrollada como **frontend con React** para la
Evaluación Parcial 2 de **DSY1104 Desarrollo Fullstack II** (Duoc UC).

Es la evolución del proyecto de la Evaluación Parcial 1, que estaba hecho con HTML, CSS y
JavaScript. En esta versión se migró a componentes de React, con rutas, estado compartido,
diseño responsivo con Bootstrap, persistencia simulada en `localStorage` y pruebas unitarias.

**Integrantes:** Esteban Varas · Víctor Cortez
**Docente:** Daniel Antonio Vega V.

## Funcionalidades

**Tienda pública**
- Inicio con carrusel, categorías, ofertas y productos destacados.
- Catálogo con búsqueda por texto y filtro por categoría, y detalle de cada producto.
- Vistas de categorías y ofertas, además de Nosotros, Blog (con detalle de artículos) y Contacto.
- Carrito de compras con cantidades, subtotales y persistencia.
- Registro e inicio de sesión de clientes, con validación de RUN, correo y contraseña.
- Checkout con datos del cliente, entrega (despacho o retiro), región y comuna.
- Pago simulado: una tarjeta que termina en `0000` se rechaza; cualquier otra se aprueba.
- Páginas de compra exitosa (con resumen del pedido) y de pago fallido.
- Página 404 para direcciones que no existen.

**Panel de administración** (`/admin`, solo para Administrador y Vendedor)
- CRUD de productos, con validación de precio y stock.
- CRUD de usuarios.
- Listado de pedidos, con cambio de estado y eliminación.

## Tecnologías

| Herramienta | Uso |
|---|---|
| React 19 | Componentes, props, estado y efectos |
| React Router 7 | Navegación, rutas con parámetros y rutas protegidas |
| Bootstrap 5.3 | Diseño responsivo |
| Context API | Estado compartido de sesión y carrito |
| localStorage | Persistencia simulada (productos, usuarios, pedidos, sesión y carrito) |
| Vite 8 | Servidor de desarrollo y empaquetado |
| Vitest 5 + Testing Library + jsdom | Pruebas unitarias y de integración |
| V8 Coverage | Reporte de cobertura de código |
| ESLint | Análisis estático del código |

No hay backend: todos los datos se guardan en el navegador.

## Requisitos previos

- [Node.js](https://nodejs.org) (versión 20.19 o superior, o 22.12 o superior) y npm.

## Instalación y ejecución

```bash
npm install
npm run dev
```

La aplicación queda disponible en la dirección que muestra la terminal (por defecto
`http://localhost:5173`).

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de producción |
| `npm run lint` | Revisa el código con ESLint |
| `npm test` | Ejecuta todas las pruebas una vez |
| `npm run test:watch` | Ejecuta las pruebas en modo observador |
| `npm run coverage` | Ejecuta las pruebas y genera el reporte de cobertura |

## Pruebas y cobertura

Resultado de la última ejecución completa:

- **44 archivos de prueba y 180 pruebas, todas aprobadas.**
- **Cobertura global:** 98,67 % en sentencias, 97,18 % en ramas, 100 % en funciones y
  98,59 % en líneas.
- El umbral mínimo está configurado en **90 %** para las cuatro métricas en `vite.config.js`;
  si la cobertura baja de ese valor, `npm run coverage` falla.

El reporte en HTML se genera en `coverage/index.html` después de ejecutar `npm run coverage`.
Esa carpeta no se incluye en el repositorio.

Cada archivo de prueba (`*.test.js` y `*.test.jsx`) está junto al archivo que prueba. Las
pruebas cubren componentes, páginas, contextos, servicios, validaciones y el panel de
administración.

## Estructura del proyecto

```
src/
├── App.jsx            Rutas de la aplicación
├── components/        Componentes reutilizables (Navbar, ProductCard, ProductList,
│                      CampoFormulario, Carrusel, ProtectedRoute...)
├── pages/             Una página por ruta (Home, Productos, Detalle, Checkout, Login...)
│   └── admin/         Pantallas del panel (productos, usuarios y pedidos)
├── context/           AuthContext (sesión) y CarritoContext (carrito)
├── data/              Servicios CRUD sobre localStorage, validaciones y datos iniciales
└── setupTests.js      Configuración de las pruebas
```

## Rutas principales

| Ruta | Vista |
|---|---|
| `/` | Inicio |
| `/productos` · `/producto/:codigo` | Catálogo y detalle |
| `/categorias` · `/ofertas` | Categorías y ofertas |
| `/carrito` · `/checkout` | Compra |
| `/compra-exitosa` · `/pago-fallido` | Resultado del pago |
| `/nosotros` · `/blog` · `/blog/:id` · `/contacto` | Informativas |
| `/login` · `/registro` | Sesión |
| `/admin/*` | Panel de administración (protegido por rol) |
| `*` | Página 404 |

## Datos de prueba

Al abrir la aplicación por primera vez se cargan productos y tres usuarios de ejemplo. Sus
datos están en `src/data/datos.js`. Son credenciales ficticias, solo para probar el proyecto.

| Rol | Correo | Contraseña | Acceso |
|---|---|---|---|
| Administrador | `admin@duoc.cl` | `1234` | Tienda y panel `/admin` |
| Vendedor | `vendedor@duoc.cl` | `1234` | Tienda y panel `/admin` |
| Cliente | `cliente@gmail.com` | `1234` | Tienda y compra |

Para probar el pago simulado, usa una tarjeta que **no** termine en `0000` para que se
apruebe (por ejemplo `4111 1111 1111 1234`), y una que termine en `0000` para que se rechace.

Para volver al estado inicial, ejecuta `localStorage.clear()` en la consola del navegador y
recarga la página.

## Flujo de trabajo en equipo

El proyecto se desarrolló con Git y GitHub: la rama `main` está protegida y los cambios se
integran mediante Pull Requests desde ramas de trabajo (`feature/tienda` y `feature/admin`).

## Limitaciones

- No existe backend ni base de datos real: la autenticación, los roles y los datos son
  simulados en el navegador.
- El pago es una simulación y no procesa información financiera.
- El correo con el comprobante de compra es solo un mensaje en pantalla; no se envía.

## Mejoras futuras

- Integrar un backend (por ejemplo, con Spring Boot) y autenticación con tokens.
- Validar el stock al agregar productos al carrito.
- Diferenciar los permisos de Vendedor y Administrador en el panel.
- Agregar al panel un dashboard con métricas, reportes y detalle de cada pedido.

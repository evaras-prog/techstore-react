import { crearUsuario, actualizarUsuario } from './usuariosService';

const base = {
  run: '444444444',
  nombre: 'Victor',
  apellidos: 'Cortez',
  correo: 'victor@gmail.com',
  password: '1234',
  tipo: 'Cliente',
  region: 'Región Metropolitana de Santiago',
  comuna: 'Santiago',
  direccion: 'Av. Principal 123',
};

describe('usuariosService (casos de error)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('no permite crear un usuario con un RUN repetido', () => {
    crearUsuario(base);

    expect(() => crearUsuario({ ...base, correo: 'otro@gmail.com' })).toThrow(
      'Ya existe un usuario con ese RUN'
    );
  });

  it('no permite crear un usuario con un correo repetido', () => {
    crearUsuario(base);

    expect(() => crearUsuario({ ...base, run: '555555555' })).toThrow(
      'Ya existe un usuario con ese correo'
    );
  });

  it('actualizar un usuario inexistente lanza un error', () => {
    expect(() => actualizarUsuario('999', { comuna: 'Maipú' })).toThrow(
      'Usuario no encontrado'
    );
  });
});
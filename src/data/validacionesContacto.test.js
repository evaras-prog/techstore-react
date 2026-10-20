import { validarContacto, MAX_MENSAJE } from './validacionesContacto';

const datosValidos = {
  nombre: 'Ana Pérez',
  correo: 'ana@correo.cl',
  asunto: 'garantia',
  mensaje: 'Hola, tengo una consulta.',
};

describe('validarContacto', () => {
  it('no devuelve errores con datos válidos', () => {
    expect(validarContacto(datosValidos)).toEqual({});
  });

  it('exige un correo con formato válido', () => {
    expect(validarContacto({ ...datosValidos, correo: 'ana@' }).correo).toBeDefined();
  });

  it('exige nombre y asunto', () => {
    const errores = validarContacto({ ...datosValidos, nombre: '  ', asunto: '' });

    expect(errores.nombre).toBeDefined();
    expect(errores.asunto).toBeDefined();
  });

  it('exige un mensaje', () => {
    expect(validarContacto({ ...datosValidos, mensaje: '   ' }).mensaje).toBeDefined();
  });

  it('rechaza un mensaje que supera el máximo de caracteres', () => {
    const largo = 'a'.repeat(MAX_MENSAJE + 1);

    expect(validarContacto({ ...datosValidos, mensaje: largo }).mensaje).toMatch(/500/);
  });
});
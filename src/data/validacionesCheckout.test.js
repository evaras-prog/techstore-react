import { validarCheckout } from './validacionesCheckout';

const datosValidos = {
  nombre: 'Ana',
  apellidos: 'Pérez',
  correo: 'ana@correo.cl',
  entrega: 'despacho',
  direccion: 'Av. Siempre Viva 123',
  region: 'Región Metropolitana de Santiago',
  comuna: 'Santiago',
  tarjeta: '4111111111111111',
};

describe('validarCheckout', () => {
  it('no devuelve errores con datos válidos', () => {
    expect(validarCheckout(datosValidos)).toEqual({});
  });

  it('exige un correo con formato válido', () => {
    const errores = validarCheckout({ ...datosValidos, correo: 'ana@' });

    expect(errores.correo).toBeDefined();
  });

  it('exige dirección, región y comuna solo si la entrega es despacho', () => {
    const vacios = { direccion: '', region: '', comuna: '' };

    const despacho = validarCheckout({ ...datosValidos, ...vacios });
    expect(Object.keys(despacho)).toEqual(
      expect.arrayContaining(['direccion', 'region', 'comuna'])
    );

    const retiro = validarCheckout({
      ...datosValidos,
      ...vacios,
      entrega: 'retiro',
    });
    expect(retiro).toEqual({});
  });

  it('exige una tarjeta de 16 dígitos', () => {
    const errores = validarCheckout({ ...datosValidos, tarjeta: '1234' });

    expect(errores.tarjeta).toBeDefined();
  });

  it('acepta una tarjeta escrita con espacios', () => {
    const errores = validarCheckout({
      ...datosValidos,
      tarjeta: '4111 1111 1111 1111',
    });

    expect(errores).toEqual({});
  });
});
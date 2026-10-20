import { validarRun } from './validaciones';

describe('validarRun (dígitos verificadores especiales)', () => {
  it('acepta un RUN cuyo dígito verificador es K', () => {
    expect(validarRun('10000013K')).toBe(true);
  });

  it('acepta un RUN cuyo dígito verificador es 0', () => {
    expect(validarRun('100000040')).toBe(true);
  });

  it('acepta un RUN escrito con puntos y guion', () => {
    expect(validarRun('10.000.013-K')).toBe(true);
  });

  it('rechaza un RUN con formato inválido', () => {
    expect(validarRun('abc')).toBe(false);
  });
});
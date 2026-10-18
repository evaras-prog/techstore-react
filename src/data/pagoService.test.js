import { procesarPago } from './pagoService';

describe('procesarPago', () => {
  it('aprueba una tarjeta normal', () => {
    expect(procesarPago('4111 1111 1111 1111').exito).toBe(true);
  });

  it('rechaza una tarjeta terminada en 0000', () => {
    expect(procesarPago('4111111111110000').exito).toBe(false);
  });
});
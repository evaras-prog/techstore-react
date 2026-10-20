import { formatoCLP } from './datos';

describe('formatoCLP', () => {
  it('da formato de pesos chilenos con separador de miles', () => {
    expect(formatoCLP(899990)).toBe('$899.990');
  });

  it('trata un valor no numérico como cero', () => {
    expect(formatoCLP('abc')).toBe('$0');
  });
});
import { obtenerArticulos, obtenerArticuloPorId } from './blogs';

describe('blogs', () => {
  it('devuelve los artículos del blog', () => {
    expect(obtenerArticulos()).toHaveLength(2);
  });

  it('busca un artículo por su id y devuelve null si no existe', () => {
    expect(obtenerArticuloPorId('laptops-2025').titulo).toBe(
      'Las mejores laptops del 2025 para estudiantes'
    );
    expect(obtenerArticuloPorId('no-existe')).toBeNull();
  });
});
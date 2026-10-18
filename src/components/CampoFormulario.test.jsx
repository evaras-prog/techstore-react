import { render, screen, fireEvent } from '@testing-library/react';
import CampoFormulario from './CampoFormulario';

function renderCampo(props = {}) {
  return render(
    <CampoFormulario
      label="Nombre"
      name="nombre"
      value=""
      onChange={() => {}}
      {...props}
    />
  );
}

describe('CampoFormulario', () => {
  it('asocia la etiqueta con su campo', () => {
    renderCampo();

    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  it('muestra el mensaje de error solo cuando hay un error', () => {
    renderCampo({ error: 'Ingresa tu nombre.' });

    expect(screen.getByText('Ingresa tu nombre.')).toBeInTheDocument();
  });

  it('no muestra ningún mensaje cuando no hay error', () => {
    renderCampo();

    expect(screen.queryByText('Ingresa tu nombre.')).not.toBeInTheDocument();
  });

  it('avisa el cambio mediante onChange al escribir', () => {
    const onChange = vi.fn();
    renderCampo({ onChange });

    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: { value: 'Ana' },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
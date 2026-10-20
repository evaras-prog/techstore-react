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

    it('dibuja una lista desplegable con sus opciones cuando as es select', () => {
    render(
      <CampoFormulario label="Asunto" name="asunto" value="" onChange={() => {}} as="select">
        <option value="">Elige</option>
        <option value="a">Opción A</option>
      </CampoFormulario>
    );

    expect(screen.getByLabelText('Asunto').tagName).toBe('SELECT');
    expect(screen.getByRole('option', { name: 'Opción A' })).toBeInTheDocument();
  });

  it('dibuja un área de texto cuando as es textarea', () => {
    render(
      <CampoFormulario label="Mensaje" name="mensaje" value="" onChange={() => {}} as="textarea" />
    );

    expect(screen.getByLabelText('Mensaje').tagName).toBe('TEXTAREA');
  });
});
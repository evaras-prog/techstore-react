import { render, screen, fireEvent } from '@testing-library/react';
import Contacto from './Contacto';

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

function presionarEnviar() {
  fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));
}

describe('Contacto', () => {
  it('muestra los datos de contacto de la tienda', () => {
    render(<Contacto />);

    expect(screen.getByRole('heading', { name: 'Dirección' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Teléfono' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Correo' })).toBeInTheDocument();
  });

  it('muestra errores al enviar el formulario vacío', () => {
    render(<Contacto />);

    presionarEnviar();

    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('Ingresa un correo válido.')).toBeInTheDocument();
    expect(screen.getByText('Selecciona un asunto.')).toBeInTheDocument();
    expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('confirma el envío y limpia el formulario cuando los datos son válidos', () => {
    render(<Contacto />);

    escribir('Nombre completo', 'Ana Pérez');
    escribir('Correo electrónico', 'ana@correo.cl');
    escribir('Asunto', 'garantia');
    escribir('Mensaje', 'Hola, tengo una consulta.');
    presionarEnviar();

    expect(screen.getByRole('alert')).toHaveTextContent('¡Mensaje enviado!');
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('');
  });
});
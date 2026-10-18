export function procesarPago(tarjeta) {
    const digitos = tarjeta.replace(/\s/g, '');
    return { exito: !digitos.endsWith('0000')};
}
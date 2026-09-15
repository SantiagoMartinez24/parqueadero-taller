// avisos.js — responsabilidad única: informar eventos del sistema (cupo lleno, entradas, salidas)
export function avisarCupoLleno(placa) {
  console.warn(`Aviso: no hay cupo disponible para ${placa}`);
  mostrarEnPantalla(`⚠️ Cupo lleno. No se pudo registrar ${placa}`);
}

export function avisarEvento(mensaje) {
  console.log(`Aviso: ${mensaje}`);
  mostrarEnPantalla(mensaje);
}

function mostrarEnPantalla(mensaje) {
  const contenedor = document.getElementById('avisos');
  if (!contenedor) return;
  const linea = document.createElement('div');
  linea.textContent = mensaje;
  contenedor.prepend(linea);
}
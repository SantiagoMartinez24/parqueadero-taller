// avisos.js — responsabilidad única: informar eventos del sistema (cupo lleno, entradas, salidas).
// No importa a ningún otro módulo del negocio.
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

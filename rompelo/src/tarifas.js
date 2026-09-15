// tarifas.js — responsabilidad única: calcular el costo de un vehículo según el tiempo parqueado
const TARIFA_POR_MINUTO = 100; // pesos por minuto

export function calcularCosto(horaEntrada, horaSalida = Date.now()) {
  const minutos = Math.max(1, Math.ceil((horaSalida - horaEntrada) / 60000));
  return minutos * TARIFA_POR_MINUTO;
}

export function formatearCosto(valor) {
  return `$${valor.toLocaleString('es-CO')}`;
}
// vehiculos.js — responsabilidad única: gestionar el estado del parqueadero (espacios y vehículos)
// NO importa avisos.js (regla R1 / ADR-002): si avisos falla, registrar una entrada o salida
// no se puede caer con él. Este módulo solo devuelve un resultado; quien lo llama decide avisar.

import { avisarEvento } from './avisos.js';

const CAPACIDAD_TOTAL = 5;
const vehiculosActivos = []; // { placa, horaEntrada }

export function registrarEntrada(placa) {
  if (vehiculosActivos.length >= CAPACIDAD_TOTAL) {
    return { ok: false, motivo: 'cupo_lleno', mensaje: `Cupo lleno. No se pudo registrar ${placa}` };
  }
  if (vehiculosActivos.some(v => v.placa === placa)) {
    return { ok: false, motivo: 'duplicado', mensaje: 'El vehículo ya está registrado' };
  }
  vehiculosActivos.push({ placa, horaEntrada: Date.now() });
  return { ok: true, mensaje: `Entrada registrada para ${placa}` };
}

export function registrarSalida(placa) {
  const index = vehiculosActivos.findIndex(v => v.placa === placa);
  if (index === -1) {
    return { ok: false, motivo: 'no_encontrado', mensaje: 'Vehículo no encontrado' };
  }
  const [vehiculo] = vehiculosActivos.splice(index, 1);
  return { ok: true, vehiculo };
}

export function listarVehiculosActivos() {
  return [...vehiculosActivos];
}

export function cuposDisponibles() {
  return CAPACIDAD_TOTAL - vehiculosActivos.length;
}

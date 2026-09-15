// vehiculos.js — responsabilidad única: gestionar el estado del parqueadero (espacios y vehículos)
import { avisarCupoLleno } from './avisos.js';

const CAPACIDAD_TOTAL = 5;
const vehiculosActivos = []; // { placa, horaEntrada }

export function registrarEntrada(placa) {
  if (vehiculosActivos.length >= CAPACIDAD_TOTAL) {
    avisarCupoLleno(placa);
    return { ok: false, mensaje: 'Cupo lleno' };
  }
  if (vehiculosActivos.some(v => v.placa === placa)) {
    return { ok: false, mensaje: 'El vehículo ya está registrado' };
  }
  vehiculosActivos.push({ placa, horaEntrada: Date.now() });
  return { ok: true, mensaje: `Entrada registrada para ${placa}` };
}

export function registrarSalida(placa) {
  const index = vehiculosActivos.findIndex(v => v.placa === placa);
  if (index === -1) {
    return { ok: false, mensaje: 'Vehículo no encontrado' };
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
// app.js — responsabilidad única: conectar la interfaz (HTML) con la lógica de negocio.
// Es el único módulo que conoce a los tres módulos de negocio; por eso es el que decide
// cuándo avisar, en vez de dejar que vehiculos.js dependa de avisos.js.
import { registrarEntrada, registrarSalida, listarVehiculosActivos, cuposDisponibles } from './vehiculos.js';
import { calcularCosto, formatearCosto } from './tarifas.js';
import { avisarEvento } from './avisos.js';

const formEntrada = document.getElementById('form-entrada');
const formSalida = document.getElementById('form-salida');
const listaVehiculos = document.getElementById('lista-vehiculos');
const cuposSpan = document.getElementById('cupos');

function actualizarVista() {
  listaVehiculos.innerHTML = '';
  listarVehiculosActivos().forEach(v => {
    const li = document.createElement('li');
    li.textContent = `${v.placa} — entrada: ${new Date(v.horaEntrada).toLocaleTimeString()}`;
    listaVehiculos.appendChild(li);
  });
  cuposSpan.textContent = cuposDisponibles();
}

formEntrada.addEventListener('submit', (e) => {
  e.preventDefault();
  const placa = document.getElementById('placa-entrada').value.trim().toUpperCase();
  if (!placa) return;
  const resultado = registrarEntrada(placa);
  avisarEvento(resultado.mensaje);
  formEntrada.reset();
  actualizarVista();
});

formSalida.addEventListener('submit', (e) => {
  e.preventDefault();
  const placa = document.getElementById('placa-salida').value.trim().toUpperCase();
  if (!placa) return;
  const resultado = registrarSalida(placa);
  if (!resultado.ok) {
    avisarEvento(resultado.mensaje);
  } else {
    const costo = calcularCosto(resultado.vehiculo.horaEntrada);
    avisarEvento(`Salida de ${placa}. Total a pagar: ${formatearCosto(costo)}`);
  }
  formSalida.reset();
  actualizarVista();
});

actualizarVista();

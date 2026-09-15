#!/usr/bin/env node
/**
 * FUNCION DE APTITUD (fitness function)
 * Verifica que el codigo respete las reglas de arquitectura declaradas
 * en arquitectura/reglas.json. Si alguien las viola, este script falla
 * y el pipeline se pone en rojo.
 *
 * Adaptado para un src/ con archivos PLANOS (uno por responsabilidad),
 * como pide el taller. El "modulo" de cada archivo es su nombre sin ".js".
 *
 * Sin dependencias. Se ejecuta con:  node tools/verificar-arquitectura.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAIZ = path.join(__dirname, '..', 'src');
const CONFIG = path.join(__dirname, '..', 'arquitectura', 'reglas.json');

function archivosJs(dir) {
  let salida = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) salida = salida.concat(archivosJs(p));
    else if (e.name.endsWith('.js')) salida.push(p);
  }
  return salida;
}

function importesDe(contenido) {
  const rutas = [];
  const patrones = [
    /import\s+[^'"]*from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
    /require\(\s*['"]([^'"]+)['"]\s*\)/g
  ];
  for (const re of patrones) {
    let m;
    while ((m = re.exec(contenido)) !== null) rutas.push(m[1]);
  }
  return rutas;
}

// Convierte una ruta relativa dentro de src/ en el nombre de su "modulo":
// - si es un archivo plano en la raiz de src/, el modulo es el nombre sin ".js"
// - si esta dentro de una subcarpeta, el modulo es el nombre de esa carpeta
function nombreModulo(relPath) {
  const partes = relPath.split(path.sep);
  if (partes.length === 1) return partes[0].replace(/\.js$/, '');
  return partes[0];
}

function moduloDeRuta(rutaImport, archivoOrigen) {
  if (!rutaImport.startsWith('.')) return null;
  const abs = path.resolve(path.dirname(archivoOrigen), rutaImport);
  const rel = path.relative(RAIZ, abs);
  if (rel.startsWith('..')) return null;
  return nombreModulo(rel);
}

const { reglas } = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));

if (!fs.existsSync(RAIZ)) {
  console.error('\n  [X] No existe la carpeta src/. No hay nada que verificar.\n');
  process.exit(1);
}
const archivos = archivosJs(RAIZ);
if (archivos.length === 0) {
  console.error('\n  [X] No se encontro ningun archivo .js en src/.');
  console.error('      Un pipeline que aprueba sin revisar nada no sirve de nada.\n');
  process.exit(1);
}
const violaciones = [];

for (const archivo of archivos) {
  const relArchivo = path.relative(RAIZ, archivo);
  const moduloActual = nombreModulo(relArchivo);
  const contenido = fs.readFileSync(archivo, 'utf8');

  for (const imp of importesDe(contenido)) {
    const destino = moduloDeRuta(imp, archivo);
    if (!destino || destino === moduloActual) continue;

    for (const r of reglas) {
      if (r.modulo === moduloActual && r.no_puede_importar.includes(destino)) {
        violaciones.push({
          regla: r.id, adr: r.adr,
          archivo: 'src/' + relArchivo,
          desde: moduloActual, hacia: destino,
          porque: r.porque
        });
      }
    }
  }
}

console.log('');
console.log('  VERIFICACION DE ARQUITECTURA');
console.log('  ' + '='.repeat(58));
console.log(`  Archivos revisados: ${archivos.length}`);
console.log(`  Reglas activas:     ${reglas.length}`);
console.log('');

if (violaciones.length === 0) {
  for (const r of reglas) {
    console.log(`  [OK] ${r.id} (${r.adr}) · ${r.modulo} no importa a ${r.no_puede_importar.join(', ')}`);
  }
  console.log('');
  console.log('  ARQUITECTURA RESPETADA. El cambio puede desplegarse.');
  console.log('');
  process.exit(0);
}

for (const v of violaciones) {
  console.log(`  [X] ${v.regla} VIOLADA  (${v.adr})`);
  console.log(`      Archivo: ${v.archivo}`);
  console.log(`      "${v.desde}" esta importando a "${v.hacia}", y no puede.`);
  console.log(`      Por que existe esta regla: ${v.porque}`);
  console.log('');
}
console.log(`  ARQUITECTURA VIOLADA: ${violaciones.length} problema(s). El despliegue se detiene.`);
console.log('');
process.exit(1);

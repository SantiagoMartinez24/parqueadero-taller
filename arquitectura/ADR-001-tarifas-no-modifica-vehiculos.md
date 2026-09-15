# ADR-001 · Tarifas no modifica el estado de los vehículos

Fecha: 15 de septiembre de 2026 · Estado: aceptada

## Contexto
Cuando un vehículo sale del parqueadero, hay que calcular cuánto debe pagar según el
tiempo que estuvo adentro. Ese cálculo necesita la hora de entrada del vehículo, pero
no tiene ninguna razón de negocio para tocar el registro de vehículos activos: no
agrega vehículos, no los borra, no cambia su estado.

## Driver que manda
El cálculo de tarifas es de solo lectura: nunca puede modificar el estado de los
vehículos ni sus registros.

## Decisión
El módulo `tarifas` **no puede importar** a `vehiculos`. Recibe únicamente los datos
que `app.js` le entrega (la hora de entrada), calcula el costo, y lo devuelve. No
consulta el arreglo de vehículos activos ni tiene forma de alterarlo.

## Alternativa descartada
Que `tarifas.js` importara `vehiculos.js` y buscara el vehículo por placa para leer su
hora de entrada. Se descartó porque, aunque hoy solo leería, nada impediría que un
cambio futuro en `tarifas` terminara escribiendo sobre el registro de vehículos —
mezclando una responsabilidad de cálculo con el estado mutable del negocio. Separar
los módulos desde ahora hace esa mezcla imposible, no solo indeseable.

## Qué pagamos
`app.js` tiene que encargarse de tomar el dato de `vehiculos` (la hora de entrada) y
pasárselo a `tarifas` cuando se registra una salida; eso es más código de coordinación
en `app.js`. `tarifas` tampoco puede, por su cuenta, calcular costos históricos o
recorrer todos los vehículos activos sin que alguien más se los entregue primero.

## Cómo se verifica
Regla **R2** en `arquitectura/reglas.json`, revisada por el pipeline en cada cambio.

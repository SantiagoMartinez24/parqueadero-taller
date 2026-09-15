# ADR-002 · Vehículos no puede depender de que Avisos responda

Fecha: 15 de septiembre de 2026 · Estado: aceptada

## Contexto
Cada vez que se registra una entrada o una salida hay que avisar: cupo lleno,
confirmación, total a pagar. La primera versión del sistema hacía esto llamando a
`avisos.js` directamente desde `vehiculos.js`. Hoy `avisos.js` solo escribe en
pantalla, pero el negocio ya habló de sumar un correo o una notificación push más
adelante — canales que sí pueden fallar o demorarse.

## Driver que manda
Si el módulo de avisos falla, el registro de entrada o salida de un vehículo **no se
puede caer**.

## Decisión
El módulo `vehiculos` **no puede importar** a `avisos`. `vehiculos` solo hace su
trabajo (registrar, contar cupos) y devuelve un resultado. Quien orquesta (`app.js`)
es quien decide avisar, según ese resultado. `avisos` queda como un módulo hoja: nadie
depende de que él responda para completar una operación de negocio.

## Alternativa descartada
Dejar la llamada directa como en la primera versión (`vehiculos` importando y
llamando a `avisos`). Es la opción más simple de leer, pero acopla lo esencial del
negocio — contar cupos, registrar un vehículo — a un módulo secundario. Si mañana
`avisos` se conecta a un servicio de correo externo y ese servicio se cae, hoy se
caería con él el registro de entradas. Eso es justamente lo que vimos en el simulador
con la llamada directa: si una pieza espera a otra y la otra falla, se cae toda la
cadena.

## Qué pagamos
`app.js` tiene que conocer a los tres módulos de negocio y coordinar cuándo avisar,
en vez de que `vehiculos` lo resuelva por su cuenta; hay más lógica de orquestación
concentrada en un solo archivo. Además, leyendo solo `vehiculos.js` ya no se ve que
al registrar una entrada también se dispara un aviso — hay que ir a `app.js` para
entender el flujo completo, lo que hace la depuración un poco más indirecta.

## Cómo se verifica
Regla **R1** en `arquitectura/reglas.json`, revisada por el pipeline en cada cambio,
y demostrada rompiéndola a propósito en los tres commits (verde · rojo · verde).

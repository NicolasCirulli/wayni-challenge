<div align="center">
  <h1>WayniWallet</h1>
  <p>Wallet web desarrollada como challenge técnico frontend para Wayni.</p>
</div>

## Índice

- [Descripción](#descripción)
- [Demo](#demo)
- [Funcionalidades](#funcionalidades)
  - [Inicio](#inicio)
  - [Flujo de transferencia](#flujo-de-transferencia)
  - [Historial](#historial)
  - [Perfil](#perfil)
- [Tecnologías](#tecnologías)
- [Arquitectura de estado](#arquitectura-de-estado)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Rutas](#rutas)
- [Requisitos](#requisitos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Scripts disponibles](#scripts-disponibles)
- [Pruebas](#pruebas)
- [Decisiones técnicas](#decisiones-técnicas)
  - [Dinero representado en centavos](#dinero-representado-en-centavos)
  - [Persistencia local](#persistencia-local)
- [Uso de IA](#uso-de-ia)
  - [Herramientas utilizadas](#herramientas-utilizadas)
  - [Chats de referencia](#chats-de-referencia)
  - [Aprendizajes](#aprendizajes)
- [Alcance](#alcance)

## Descripción

WayniWallet permite consultar el saldo de una billetera, ver sus últimos movimientos, elegir un contacto y completar un flujo de transferencia. La aplicación consume usuarios desde Random User API, mantiene el borrador de la transferencia en memoria y persiste el saldo y los movimientos en `localStorage`.

El diseño toma como referencia el [archivo de Figma provisto para el challenge](https://www.figma.com/design/ppzcbVZJLzYfEvw3Yokt9N/WayniWallet) y extiende el mismo sistema visual para las pantallas de confirmación, error y resultado.

## Demo

La aplicación está disponible en [wayni.nicolascirulli.com.ar](https://wayni.nicolascirulli.com.ar/).

## Funcionalidades

### Inicio

- Muestra el nombre y avatar del usuario principal.
- Presenta el saldo formateado en pesos argentinos.
- Permite iniciar una transferencia desde diez contactos frecuentes.
- Lista los últimos movimientos y distingue visualmente ingresos y egresos.
- Incluye estados de carga, error y contenido vacío.

### Flujo de transferencia

El flujo se divide en cuatro pantallas:

1. Selección del destinatario.
2. Ingreso del monto y concepto.
3. Confirmación de los datos.
4. Resultado de la operación.

Durante el flujo se aplican las siguientes reglas:

- El monto debe ser mayor que cero.
- Se aceptan números enteros o con hasta dos decimales, utilizando punto o coma.
- Los importes se convierten a centavos enteros antes de realizar cálculos.
- No se puede transferir un monto superior al saldo disponible.
- No se permite transferir al usuario principal.
- El concepto es obligatorio y admite hasta 25 caracteres.
- La confirmación queda bloqueada mientras la operación está en curso.
- Un bloqueo sincrónico evita que un doble click genere dos movimientos.
- Una transferencia exitosa descuenta el saldo, guarda el movimiento y actualiza la interfaz sin recargar la página.
- El resultado muestra una referencia de ocho dígitos y permite compartir el comprobante cuando el navegador soporta Web Share.

En desarrollo, la pantalla de confirmación incluye un control para forzar un error. Cuando la operación falla, el saldo y los movimientos no cambian, se ofrece un reintento y el borrador se conserva.

### Historial

- Lista únicamente movimientos de tipo transferencia.
- Muestra participante, avatar, fecha, hora y monto.
- Diferencia transferencias entrantes y salientes.
- Incluye un estado vacío cuando todavía no hay transferencias.
- Permite comenzar una nueva transferencia desde la misma pantalla.

### Perfil

- Presenta en modo de solo lectura el identificador, nombre, ubicación, correo electrónico y teléfono del usuario principal.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| Next.js 16 | App Router, rutas y optimización de imágenes |
| React 19 | Componentes funcionales y hooks |
| TypeScript | Tipado estático de la aplicación |
| TanStack Query 5 | Consulta y caché de usuarios remotos |
| Zustand 5 | Borrador del flujo de transferencia |
| Tailwind CSS 4 | Estilos y diseño responsive |
| Jest 30 | Ejecución de pruebas |
| Testing Library | Pruebas de hooks y componentes |

## Arquitectura de estado

La aplicación separa el estado según su origen y responsabilidad:

| Estado | Solución | Responsabilidad |
| --- | --- | --- |
| Usuarios | TanStack Query | Obtener y cachear el usuario principal y los contactos |
| Borrador | Zustand | Mantener destinatario, monto, concepto y origen durante el flujo |
| Billetera | `localStorage` + `useSyncExternalStore` | Persistir saldo y movimientos y sincronizarlos con React |

La consulta a Random User API utiliza una semilla fija y solicita once usuarios: el primero se usa como titular y los diez restantes como contactos. TanStack Query mantiene los datos frescos durante 30 minutos, los conserva en caché durante una hora y evita refetch al volver a enfocar la ventana.

La billetera utiliza el evento nativo `storage` para sincronizar cambios entre pestañas y un evento personalizado para actualizar la interfaz dentro de la misma pestaña.

## Estructura del proyecto

```text
src/
├── app/          # Rutas, layouts y páginas con App Router
├── components/   # Componentes visuales y estados compuestos
├── hooks/        # Integración de usuarios y billetera con React
├── mappers/      # Adaptación de respuestas externas al dominio
├── providers/    # Proveedores globales
├── services/     # Acceso a usuarios y operaciones de la billetera
├── store/        # Borrador de transferencia con Zustand
├── types/        # Contratos de usuario, billetera y movimientos
└── utils/        # Formateo y conversión de importes y fechas

test/
├── components/
├── hooks/
├── mappers/
├── services/
└── utils/
```

Los layouts compartidos definen la estructura responsive de las pantallas. Las páginas orquestan datos y navegación, mientras que los componentes visuales agrupan sus variantes relacionadas mediante APIs como `Component.Skeleton` y `Component.Error`.

## Rutas

| Ruta | Descripción |
| --- | --- |
| `/` | Inicio, saldo, contactos frecuentes y últimos movimientos |
| `/transfers` | Historial de transferencias |
| `/profile` | Perfil del usuario principal |
| `/transfer` | Selección de destinatario |
| `/transfer/[id]/detail` | Ingreso del monto y concepto |
| `/transfer/[id]/confirm` | Confirmación de la transferencia |
| `/transfer/result/[id]` | Resultado y detalle del movimiento |

## Requisitos

- Node.js 20.9 o superior.
- pnpm 11.

La aplicación no requiere variables de entorno para ejecutarse localmente.

## Instalación y ejecución

```bash
pnpm install
pnpm dev
```

Luego se puede abrir [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Genera el build de producción |
| `pnpm start` | Ejecuta el build de producción |
| `pnpm lint` | Analiza el código con ESLint |
| `pnpm test` | Ejecuta las pruebas con Jest |

## Pruebas

La suite contiene pruebas de:

- Conversión y formateo de importes.
- Formateo de fechas.
- Mapeo de usuarios remotos.
- Lectura, validación y persistencia de la billetera.
- Generación de números de referencia de ocho dígitos sin repetir.
- Rechazo de transferencias que superan el saldo.
- Actualización reactiva del saldo y el historial.
- Validaciones de la pantalla de detalle.
- Protección frente a destinatarios inválidos y auto-transferencias.
- Estado vacío y representación visual del historial.

Para ejecutar todas las verificaciones principales:

```bash
pnpm lint
pnpm test -- --runInBand
pnpm build
```

## Decisiones técnicas

Todas las decisiones de arquitectura de esta aplicación fueron tomadas por mí. La excepción fue el aprendizaje necesario para utilizar `useSyncExternalStore`, cuya investigación y comprensión apoyé con documentación, videos y consultas a una IA.

### Dinero representado en centavos

Los montos se almacenan y calculan como enteros en centavos. El texto ingresado por el usuario se valida y convierte antes de operar, evitando cálculos monetarios con números de punto flotante.

### Persistencia local

El challenge no utiliza un backend de movimientos. La billetera se inicializa con datos locales y cada operación válida se serializa en `localStorage`. Al recuperar la información, el servicio valida su estructura y reconstruye las fechas antes de exponerla a la interfaz.

## Uso de IA

Durante el desarrollo del challenge utilicé herramientas de inteligencia artificial como apoyo para implementar, investigar y revisar el proyecto.

Las decisiones de arquitectura, estructura del proyecto, flujo funcional, modelo de datos y alcance fueron tomadas por mí. La IA se utilizó principalmente para generar, revisar y ajustar helpers y utilidades a demanda, a partir de necesidades concretas del desarrollo.

En un principio dejé bastante libertad a la IA para que haga la maquetación rápido porque quería priorizar la funcionalidad, tenía en mente refactorizar la UI cuando llegara al final, se puede ver en el chat de referencia 1 al inicio cómo uso codex + mcp de figma para hacer las primeras vistas, extraer las variables y assets, de esa manera, mientras le pedía que implemente la vista con datos mock iba pensando cómo iba a encarar las cosas.

La mayoría de los test los creó la IA, yo hice los que eran requeridos por el challenge y los otros se los pedí que los cree, en cuando a helpers y formatters, también lo delegué bastante, se los pedí diciéndole cómo quería que funcionar y que métodos/api usar, algunos los fui haciendo con el autocomplete de antigravity.

Donde sí necesité bastante ayuda fue con useSyncExternalStore, nunca había utilizado el hook, fue con lo que más me trabé porque si bien se lo podía pedir a la IA que lo implemente, si no me sentaba un rato a verlo no iba a entender cómo funcionaba después.

Cuando terminé la parte funcional, hice un refactor grande de la UI, implementé manualmente la UI del home con algunos autocomplete de antigravity, al tener el caso de ejemplo completo, fui a codex y con un /goal lo hice replicar los mismos patrones a todos los componentes de la app

### Herramientas utilizadas

- **Codex:** implementación de código, auditorías y preparación de commits.
- **Antigravity IDE:** autocompletado de código.
- **MCP de Figma:** obtención de assets y contexto del diseño de la aplicación para Codex.
- **Gemini App:** investigación de conceptos que no conocía o necesitaba comprender con mayor profundidad.

### Chats de referencia

- **ChatGPT:** [chat de referencia 1](https://chatgpt.com/s/cx_6aa1b89e7b408191b463b0d6cdaaccb0).
- **ChatGPT:** [chat de referencia 2](https://chatgpt.com/s/cx_6aa1b85dc35c8191b3764bb1924f28d0).

### Aprendizajes

#### `useSyncExternalStore`

Durante este challenge no sabía utilizar `useSyncExternalStore`. Como el estado de la billetera vive en `localStorage`, y no dentro del estado interno de React, tuve que aprender cómo conectar un store externo con los componentes de React.

El hook [`useWallet`](src/hooks/useWallet.ts) utiliza esta API para:

- Obtener un snapshot estable de la billetera.
- Suscribirse a cambios del evento `storage` entre pestañas.
- Suscribirse a un evento personalizado para actualizar la interfaz cuando la billetera cambia en la misma pestaña.
- Definir un snapshot para el servidor y evitar problemas durante la hidratación de Next.js.
- Inicializar la billetera en el cliente cuando todavía no existe.

Recursos consultados:

- [Documentación oficial de React sobre `useSyncExternalStore`](https://es.react.dev/reference/react/useSyncExternalStore#extracting-the-logic-to-a-custom-hook).
- [Video sobre `useSyncExternalStore`](https://www.youtube.com/watch?v=NBjycPpPHQQ).
- Consultas puntuales a una IA para entender el contrato de `subscribe`, `getSnapshot` y `getServerSnapshot`, además de su interacción con `localStorage` y la hidratación.

#### `navigator.share`

Para implementar la opción de compartir el comprobante investigué el funcionamiento de la Web Share API y el método `navigator.share`.

Recursos consultados:

- [Investigación realizada con Gemini](https://share.gemini.google/8YJ5eAMA9dsZ).
- [Ejemplos de `Navigator.share` en MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#examples).

## Alcance

WayniWallet es una implementación frontend del challenge. No incluye autenticación, backend transaccional ni transferencias reales: las operaciones y los fallos de red se simulan localmente para demostrar el flujo, las validaciones y la actualización reactiva de la interfaz.

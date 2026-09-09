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
  - [Separación entre services, mappers y hooks](#separación-entre-services-mappers-y-hooks)
  - [Separación del estado según su responsabilidad](#separación-del-estado-según-su-responsabilidad)
  - [Uso de TanStack Query detrás de un hook](#uso-de-tanstack-query-detrás-de-un-hook)
  - [Refactor de la UI y layouts compartidos](#refactor-de-la-ui-y-layouts-compartidos)
  - [Componentes compuestos](#componentes-compuestos)
  - [Flujo de transferencia basado en rutas](#flujo-de-transferencia-basado-en-rutas)
  - [Validaciones en cada etapa](#validaciones-en-cada-etapa)
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
- El concepto admite hasta 25 caracteres.
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

La consigna del challenge definía algunas herramientas y restricciones, entre ellas el uso de una capa de servicios, TanStack Query para los datos remotos y Zustand para el borrador de la transferencia.

A partir de esas condiciones, las principales decisiones estuvieron relacionadas con cómo separar responsabilidades, aislar dependencias externas, estructurar el estado, organizar el flujo de transferencia y mantener una UI simple de modificar.

### Separación entre services, mappers y hooks

La capa de `services` estaba prevista en la consigna. Sobre esa estructura agregué una capa de `mappers` para evitar que el resto de la aplicación dependa directamente de la forma de las respuestas externas.

Por ejemplo, los datos obtenidos desde Random User API se transforman primero al modelo utilizado internamente por WayniWallet. De esta manera, si cambia la estructura del payload de la API, el impacto queda concentrado principalmente en el mapper en lugar de propagarse por componentes y lógica de presentación.

Sobre esa capa utilicé hooks como `useUsers` y `useWallet` para que los componentes tampoco necesiten conocer los detalles de la implementación utilizada para obtener o sincronizar los datos.

En el caso de los usuarios, los componentes consumen `useUsers` en lugar de utilizar TanStack Query directamente. Esto agrega una abstracción pequeña, pero permite cambiar en el futuro la estrategia de obtención de datos sin modificar las vistas que los utilizan.

La separación general queda conceptualmente de esta manera:

```text
API / localStorage
        ↓
     services
        ↓
      mapper
        ↓
       hooks
        ↓
    componentes
```

No todas las capas intervienen necesariamente en todos los casos. El objetivo es que cada una tenga una responsabilidad clara y que los componentes de presentación conozcan la menor cantidad posible de detalles sobre el origen de los datos.

### Separación del estado según su responsabilidad

Preferí no utilizar una única solución para todo el estado de la aplicación.

Los usuarios provienen de una fuente remota, por lo que TanStack Query se encarga de su consulta y caché.

El borrador de transferencia representa estado temporal del flujo y se mantiene con Zustand, tal como indicaba la consigna.

La billetera, en cambio, debía persistir entre recargas sin un backend real. Por ese motivo su estado se mantiene en `localStorage` y se conecta con React mediante `useSyncExternalStore`.

Inicialmente consideré utilizar Zustand también para la billetera, ya que habría simplificado la implementación, pero preferí respetar la separación propuesta por el challenge y utilizar Zustand únicamente para el draft.

De esta manera cada herramienta resuelve un problema diferente:

* **TanStack Query:** server state.
* **Zustand:** estado temporal del flujo.
* **`localStorage` + `useSyncExternalStore`:** estado persistente de la billetera.

### Uso de TanStack Query detrás de un hook

TanStack Query era un requerimiento del challenge y lo utilicé para resolver la consulta y caché de usuarios.

La decisión adicional fue encapsular su utilización dentro de `useUsers`, evitando que los componentes dependan directamente de `useQuery` o de la configuración del cliente.

También configuré `refetchOnWindowFocus` en `false`. Los usuarios utilizados por el challenge se obtienen mediante una consulta con una semilla fija y no representan información que necesite actualizarse cada vez que el usuario vuelve a enfocar la aplicación, por lo que preferí evitar requests innecesarios.

### Refactor de la UI y layouts compartidos

La primera implementación visual se realizó rápidamente a partir del Figma para poder priorizar el desarrollo funcional.

Como consecuencia, esa primera versión tenía varios valores tomados directamente del diseño, estructuras con `flex` innecesariamente anidadas y markup que podía simplificarse.

Una vez terminado el flujo funcional hice un refactor general de la interfaz.

Preferí centralizar en layouts compartidos la estructura principal de las vistas, especialmente el comportamiento responsive, los márgenes, los contenedores y la navegación.

Esto permite que un cambio estructural común pueda realizarse en un único lugar y propagarse a todas las pantallas que utilizan ese layout. Al mismo tiempo, los componentes aceptan personalización mediante props y `className`, por lo que una pantalla puntual puede modificar su comportamiento cuando sea necesario.

### Componentes compuestos

Para algunos componentes elegí una API de componentes compuestos, utilizando estructuras como:

```tsx
Component
Component.Skeleton
Component.Error
```

La intención fue mantener juntas las variantes que pertenecen al mismo concepto visual y hacer que su utilización desde las páginas sea más declarativa.

Además, preferí esta estructura antes que generar numerosos archivos independientes para pequeños estados visuales relacionados entre sí.

### Flujo de transferencia basado en rutas

Decidí implementar cada fase de la transferencia como una página independiente en lugar de construir un único wizard dentro de una misma vista.

No fue una decisión de performance, sino de organización del flujo.

Cada etapa tiene reglas y responsabilidades diferentes, y utilizar rutas permite que cada página se encargue únicamente de las validaciones correspondientes a su fase.

El draft almacenado en Zustand funciona como nexo entre las distintas pantallas y permite mantener los datos ingresados mientras el usuario avanza por el flujo.

El proceso queda dividido en:

```text
/transfer
    ↓
/transfer/[id]/detail
    ↓
/transfer/[id]/confirm
    ↓
/transfer/result/[id]
```

Esto también evita concentrar toda la lógica de la transferencia en un único componente con múltiples estados internos para determinar qué paso debe mostrarse.

#### Fase 1: selección del destinatario

La primera fase es la más simple.

Cuando el usuario selecciona un contacto se crea el draft de la transferencia con el destinatario correspondiente y luego se navega hacia la pantalla de detalle.

También guardo el origen desde el cual comenzó la operación, diferenciando si la transferencia se inició desde `/transfer` o desde el home.

Esto permite conservar contexto de navegación sin acoplar esa decisión a las siguientes pantallas.

#### Fase 2: ingreso del monto y concepto

Antes de permitir interactuar con la pantalla se validan varias condiciones necesarias para continuar el flujo:

* Debe existir el usuario principal.
* Debe existir un draft activo.
* El destinatario debe ser válido.
* El usuario no puede transferirse dinero a sí mismo.

Si alguna de esas condiciones no se cumple, la vista no permite continuar normalmente con la operación.

El monto se mantiene como `string` mientras el usuario escribe. Esto permite controlar de forma explícita formatos como:

```text
100
100,50
100.50
```

La entrada se valida y posteriormente se transforma mediante un helper a un valor entero expresado en centavos.

A partir de ese momento las reglas monetarias trabajan solamente con enteros, lo que permite validar, entre otras cosas:

* Que el monto sea mayor que cero.
* Que tenga como máximo dos decimales.
* Que no supere el saldo disponible.

El concepto es opcional y admite hasta 25 caracteres.

Mientras los valores no sean válidos, el botón de submit permanece deshabilitado.

De todas maneras, las mismas condiciones vuelven a verificarse dentro del handler de envío. El estado `disabled` mejora la experiencia de usuario, pero no se utiliza como única garantía de que los datos sean válidos.

#### Fase 3: confirmación

La pantalla de confirmación vuelve a comprobar que el estado necesario para ejecutar la operación siga siendo válido.

Esta repetición es intencional: cada ruta valida sus propias precondiciones en lugar de asumir que el usuario necesariamente llegó desde la pantalla anterior.

Al confirmar, la operación se delega al servicio de billetera, donde vuelven a aplicarse las reglas correspondientes al dominio de la transferencia.

Entre ellas:

* El movimiento debe representar una transferencia saliente.
* El monto debe ser válido.
* Debe existir saldo suficiente.
* La operación no puede generar dos movimientos ante una doble confirmación.

La UI bloquea el botón mientras la operación se encuentra en curso para evitar nuevas interacciones desde la vista.

Además de ese bloqueo visual, la ejecución utiliza un bloqueo sincrónico para evitar que dos llamadas iniciadas antes de que React procese el siguiente render puedan crear dos movimientos. De esta manera, la protección contra una doble transferencia no depende únicamente del estado visual del componente.

Si alguna condición falla, la billetera no se modifica y el draft permanece disponible para permitir un reintento.

#### Fase 4: resultado

Cuando la transferencia termina correctamente se navega hacia una ruta cuyo parámetro corresponde al identificador del movimiento creado.

La pantalla busca ese movimiento dentro de la billetera y valida que realmente exista y represente una operación válida antes de mostrar el comprobante.

Esto evita construir la pantalla de resultado únicamente a partir de datos temporales conservados en memoria.

Una vez validada la operación, se limpia el draft porque el flujo ya fue completado.

El comprobante incluye además una pequeña funcionalidad para compartir la transferencia utilizando la Web Share API cuando está disponible.

Decidí no generar un PDF ni una imagen para el challenge. La función comparte directamente un resumen en texto con los datos principales de la operación, manteniendo la implementación dentro del alcance solicitado.

### Validaciones en cada etapa

Las validaciones están presentes en distintos niveles de manera deliberada.

Las páginas validan que el flujo tenga el contexto necesario para poder utilizarse, los formularios validan los datos ingresados y el servicio valida nuevamente las reglas necesarias antes de modificar la billetera.

Esto permite que cada capa sea responsable de las reglas que le corresponden y evita depender exclusivamente de la navegación normal de la interfaz.

Estas validaciones no pretenden funcionar como una barrera de seguridad: WayniWallet es una aplicación frontend sin backend transaccional. En una aplicación real, las validaciones definitivas de saldo, identidad y ejecución de la transferencia deberían realizarse en un backend.

### Dinero representado en centavos

Los montos se almacenan y calculan como enteros en centavos.

El texto ingresado por el usuario se mantiene inicialmente como `string`, se valida y luego se convierte antes de realizar cualquier operación monetaria.

Por ejemplo:

```text
"1500,50"
    ↓
150050
```

Esto evita depender de operaciones con números de punto flotante para representar dinero y simplifica las comparaciones de saldo y las operaciones sobre movimientos.

El formateo a pesos argentinos queda reservado para la capa de presentación.

### Persistencia local

El challenge no utiliza un backend de movimientos.

La billetera se inicializa con datos locales y cada operación válida se serializa en `localStorage`.

Al recuperar la información, el servicio valida su estructura y reconstruye valores que no pueden conservar su tipo original al serializarse, como las instancias de `Date`, antes de exponer los datos nuevamente a la aplicación.

`useSyncExternalStore` se utiliza como integración entre ese store externo y React, permitiendo mantener actualizados los componentes cuando cambia la billetera tanto dentro de la misma pestaña como entre diferentes pestañas.

## Uso de IA

Durante el desarrollo del challenge utilicé herramientas de inteligencia artificial como apoyo para implementar, investigar y revisar el proyecto.

La consigna definía parte del stack y algunas restricciones de arquitectura. A partir de esas condiciones, las decisiones sobre cómo integrar las herramientas requeridas, estructurar el proyecto, organizar el flujo funcional, modelar los datos internos y definir el alcance de la implementación fueron tomadas por mí.

La IA se utilizó principalmente para acelerar tareas de implementación, generar y revisar helpers y utilidades, crear pruebas adicionales y consultar conceptos puntuales durante el desarrollo.

En un principio dejé bastante libertad a la IA para realizar rápidamente la maquetación porque quería priorizar la funcionalidad. Desde el comienzo tenía previsto refactorizar la UI una vez terminado el flujo principal.

Esto puede verse en el chat de referencia 1, donde inicialmente utilicé Codex junto con el MCP de Figma para implementar las primeras vistas, extraer variables y obtener assets del diseño. Mientras la IA trabajaba sobre esas primeras vistas con datos mock, fui definiendo cómo iba a estructurar la aplicación y resolver el flujo funcional.

La mayoría de los tests adicionales fueron creados con ayuda de IA. Implementé personalmente los requeridos por el challenge y luego pedí generar casos adicionales para ampliar la cobertura.

También delegué parte de la implementación de helpers y formatters, indicando previamente el comportamiento esperado y, cuando correspondía, los métodos o APIs que quería utilizar. Algunos de ellos también fueron desarrollados utilizando el autocompletado de Antigravity.

Donde más asistencia necesité fue con `useSyncExternalStore`, ya que nunca había utilizado este hook. Fue la parte del challenge en la que más tiempo dediqué a investigar y entender el funcionamiento antes de dejar la implementación definitiva.

Una vez terminada la parte funcional hice un refactor general de la UI. Implementé manualmente el home utilizando algunos autocompletados de Antigravity y, una vez definido ese patrón, utilicé Codex con un `/goal` para replicar la misma estructura sobre el resto de los componentes de la aplicación.

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

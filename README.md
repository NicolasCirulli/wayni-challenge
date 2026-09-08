## Aprendizaje: `useSyncExternalStore`

Durante este challenge no sabía utilizar `useSyncExternalStore`. Como el estado de la wallet vive en `localStorage`, y no dentro del estado interno de React, tuve que aprender cómo conectar un store externo con los componentes de React.

El hook [`useWallet`](src/hooks/useWallet.ts) utiliza esa API para:

- Obtener un snapshot estable de la wallet.
- Suscribirse a cambios del evento `storage` entre pestañas.
- Suscribirse a un evento personalizado para actualizar la UI cuando la wallet cambia en la misma pestaña.
- Definir un snapshot para el servidor y evitar problemas durante la hidratación de Next.js.
- Inicializar la wallet en el cliente cuando todavía no existe.

### Recursos consultados

- [Documentación oficial de React: `useSyncExternalStore`](https://es.react.dev/reference/react/useSyncExternalStore#extracting-the-logic-to-a-custom-hook)
- [Video sobre `useSyncExternalStore`](https://www.youtube.com/watch?v=NBjycPpPHQQ)
- Consultas puntuales a una IA para entender el contrato de `subscribe`, `getSnapshot` y `getServerSnapshot`, además de su interacción con `localStorage` y la hidratación.

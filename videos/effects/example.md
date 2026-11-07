# `signalMethod` — Antes y después

Basado en [NgRx Signals · signalMethod](https://ngrx.io/guide/signals/signal-method).

`signalMethod` reemplaza el patrón manual de `effect` + `untracked` cuando quieres ejecutar un side effect cada vez que cambia un signal (o un valor reactivo).

---

## Antes — `effect` + `untracked`

```ts
import { effect, signal, untracked } from '@angular/core';

export class Numbers {
  mySignal = signal(12);

  constructor() {
    effect(() => {
      const value = this.mySignal();

      untracked(() => {
        const double = value * 2;
        console.log(double);
      });
    });
  }
}
```

Qué hace este patrón:

1. `effect` se re-ejecuta cuando cambia `mySignal`.
2. Lees el signal dentro del `effect` para crear la dependencia reactiva.
3. Envuelves el side effect en `untracked` para no crear dependencias extra dentro de la lógica.

---

## Después — `signalMethod`

```ts
import { signal } from '@angular/core';
import { signalMethod } from '@ngrx/signals';

export class Numbers {
  mySignal = signal(12);

  logDoubledNumber = signalMethod<number>((num) => {
    const double = num * 2;
    console.log(double);
  });

  constructor() {
    this.logDoubledNumber(this.mySignal);
  }
}
```

Qué cambia:

- El side effect vive en un método reutilizable (`logDoubledNumber`).
- Pasas el signal a `signalMethod` y él gestiona la suscripción reactiva.
- Ya no necesitas `effect` ni `untracked` a mano.

---

## Resumen

| | Antes | Después |
|---|---|---|
| API | `effect` + `untracked` | `signalMethod` |
| Side effect | Inline en el constructor | Método tipado y reutilizable |
| Reactividad | Manual (leer signal + `untracked`) | Automática al pasar el signal |

Fuente: https://ngrx.io/guide/signals/signal-method

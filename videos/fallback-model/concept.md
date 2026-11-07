# Concepto: FallbackModel en Google ADK

Fuente principal: [docs/guides/models/fallback_model/index.md](https://github.com/google/adk-python/blob/main/docs/guides/models/fallback_model/index.md) de `google/adk-python`.
Insumo narrativo: `captions.srt` (transcript del video).

---

## 1. El problema

Los proveedores de LLM tienen límites de tasa y se caen. Sin un plan B, un error `429` o `503` sale de la llamada al modelo, atraviesa el flujo del agente y termina la invocación.

El transcript lo describe así:

- El modelo responde `503`: "alta demanda, no responde directamente".
- El agente se queda **mudo**: nadie responde al usuario.
- Los **reintentos** en el mismo modelo empeoran la saturación, porque cada reintento suma carga al servicio que ya está pico.

> **Idea clave:** el mal momento de un proveedor no debe convertirse en la caída del agente.

---

## 2. La solución: un modelo que envuelve otros modelos

`FallbackModel` recibe una lista ordenada de modelos y prueba uno tras otro. Devuelve la primera respuesta que obtiene.

Es un `BaseLlm`, así que el agente lo trata igual que cualquier otro modelo. `LlmAgent.model` lo acepta sin cambios.

```python
from google.adk.agents import LlmAgent
from google.adk.models import FallbackModel

agent = LlmAgent(
    name='reliable_agent',
    model=FallbackModel(models=['gemini-3.1-pro-preview', 'gemini-3.5-flash']),
    instruction='You are a helpful assistant.',
)
```

Si `gemini-3.1-pro-preview` responde `429`, la misma petición va a `gemini-3.5-flash`. El agente recibe una respuesta normal.

---

## 3. Flujo paso a paso

```
Petición del usuario
        │
        ▼
┌───────────────────┐
│  FallbackModel    │
└───────────────────┘
        │
        ▼
  Modelo 1 (primario) ──── éxito ────► respuesta al agente
        │
   error con status
   en retriable_status_codes
        │
        ▼
  Modelo 2 (respaldo) ──── éxito ────► respuesta al agente
        │
       ...
        │
   todos fallaron
        ▼
  se propaga el último error
```

Puntos del diagrama que el video debe mostrar:

1. El primario falla con `503`.
2. La petición se reenvía al respaldo sin que el usuario lo note.
3. La respuesta llega, aunque tarde un poco más ("tal vez dure un ratito más la respuesta, pero tiene una respuesta").

---

## 4. Cómo decide cuándo cambiar de modelo

### 4.1 Solo códigos de estado reintentables

Por defecto, el cambio ocurre con estos estados:

```python
DEFAULT_STATUS_CODES = {429, 500, 502, 503, 504}
```

Un error **sin estado** (una conexión caída, un bug en un callback) nunca llegó al servicio. No es motivo para probar otro modelo, así que se propaga tal cual.

### 4.2 Excluidos a propósito

- `408` (timeout) no está en el conjunto: un timeout no dice si el servicio procesó la petición antes de fallar.
- Los errores `APIConnectionError` y `APIResponseValidationError` de litellm traen status `500` hardcodeado, pero no son errores de servidor. Se tratan como sin estado.

### 4.3 Personalizar la lista

```python
from google.adk.models import FallbackModel

# Solo cambiar por rate limit
FallbackModel(
    models=['gemini-3.1-pro-preview', 'gemini-3.5-flash'],
    retriable_status_codes=frozenset({429}),
)

# Ampliar a un proveedor que usa 529 para sobrecarga
FallbackModel(
    models=['gemini-3.1-pro-preview', 'gemini-3.5-flash'],
    retriable_status_codes=FallbackModel.DEFAULT_STATUS_CODES | {529},
)
```

---

## 5. Entradas: nombres o instancias

Cada entrada de `models` puede ser:

- **Un string**: ADK lo resuelve con `LLMRegistry.new_llm` y lo cachea.
- **Una instancia**: útil cuando el respaldo necesita configuración propia.

```python
from google.adk.models import FallbackModel
from google.adk.models.google_llm import Gemini
from google.genai import types

FallbackModel(
    models=[
        'gemini-3.1-pro-preview',
        Gemini(
            model='gemini-3.5-flash',
            retry_options=types.HttpRetryOptions(attempts=3),
        ),
    ],
)
```

La resolución se hace al primer uso, no al construir. Así, nombrar un respaldo `Claude` no importa el paquete `anthropic` hasta que de verdad se necesita. El costo: un nombre mal escrito aparece cuando se necesita el respaldo, no al definir el agente.

---

## 6. Qué pasa dentro: rollback y nombre del delegado

Antes de enviar, los modelos editan la petición (añaden turnos, preprocesan herramientas, etc.). Si el primario falla **después** de haber editado la petición, ADK revierte esos cambios antes de probar el siguiente. Si no, el respaldo heredaría configuración que nadie le pidió.

Además, el nombre del modelo que responde se escribe en `LlmRequest.model` antes de llamar. Así el respaldo llama al modelo correcto y no al nombre del primario.

---

## 7. Streaming: cuándo ya no se puede cambiar

- Si el modelo ya emitió la **primera respuesta** del turno, el turno le pertenece. Si falla después, el error se propaga.
- La razón: el caller ya tiene los chunks emitidos. Empezar otro modelo mezclaría la salida de dos modelos en un mismo turno.
- Una llamada **no-streaming** emite una sola vez, así que casi siempre falla antes y puede cambiar de modelo.

---

## 8. Tres capas distintas (no confundir)

| Capa | Qué hace | Quién la controla |
| :--- | :--- | :--- |
| Reintentos de un modelo | Reintenta la misma llamada al mismo modelo | `Gemini(retry_options=...)` o `ApigeeLlm` |
| Fallback entre modelos | Cambia a otro modelo de la lista | `FallbackModel` |
| Enrutamiento del servidor | El servicio elige el modelo por nombre | nombres como `model-optimizer-*` en Vertex AI |

`FallbackModel` prueba **cada modelo una sola vez**. Así un 429 no se reintenta dos veces por dos capas que no se conocen entre sí.

Alternativa cuando todo pasa por LiteLLM:

```python
LiteLlm(model=..., fallbacks=[...])  # el fallback ocurre dentro de litellm
```

Los dos se pueden componer: un `LiteLlm` configurado así puede ser una entrada de `FallbackModel`.

---

## 9. Cuando todos fallan

El último error del último proveedor se propaga. Para responder algo en vez de terminar la invocación, se usa el callback de error del agente:

```python
from google.adk.agents import LlmAgent
from google.adk.agents.callback_context import CallbackContext
from google.adk.models import FallbackModel
from google.adk.models.llm_request import LlmRequest
from google.adk.models.llm_response import LlmResponse
from google.genai import types


def on_model_error(
    callback_context: CallbackContext,
    llm_request: LlmRequest,
    error: Exception,
) -> LlmResponse:
    return LlmResponse(
        content=types.Content(
            role='model',
            parts=[types.Part(text='Every model is unavailable; try again.')],
        )
    )


agent = LlmAgent(
    name='reliable_agent',
    model=FallbackModel(models=['gemini-3.1-pro-preview', 'gemini-3.5-flash']),
    on_model_error_callback=on_model_error,
)
```

Este callback también cubre fallos que el fallback no puede absorber: un estado no reintentable, o un fallo después de empezar a streamear.

---

## 10. Sesiones en vivo (live)

- `connect` prueba cada modelo en orden y usa el primero que acepta la conexión. Hasta que la conexión está abierta, nada se ha perdido, así que cambiar es seguro.
- Una vez abierta, la sesión pertenece a ese modelo. Un respaldo no puede retomar una sesión bidireccional en curso.
- Si una sesión en vivo se cae, se reconecta al **mismo** modelo dueño, no a otro.

---

## 11. Limitaciones (lo que el video no debe prometer)

- **Experimental.** Se activa por defecto y avisa la primera vez que se construye. Para apagarlo: `ADK_DISABLE_FALLBACK_MODEL`.
- **Un proveedor caído no es un disparador.** Si el servicio no responde (no da error, simplemente no está), el fallback no ayuda. Sirve contra un servicio **que está arriba y rechaza trabajo**.
- **`capabilities` reporta al primario**, aunque responda un respaldo. Conviene que las entradas sean parecidas en capacidades.
- **El tipo concreto queda oculto.** Un `FallbackModel` no es un `Gemini`, así que código que verifica el tipo no lo reconoce.

---

## 12. Mensajes clave para el video

1. Un proveedor que falla no debe dejar mudo al agente.
2. Cambiar de modelo es un plan B, no un reintento: no satura más al servicio que ya está en pico.
3. Solo cambia cuando el error trae un estado reintentable.
4. Cada modelo se prueba una vez; los reintentos viven en su propia capa.
5. Si ya empezó a salir una respuesta en streaming, no se cambia de modelo a mitad.
6. Es experimental: úsalo sabiendo que la API puede cambiar.

---

## 13. Escenas sugeridas (para animar después)

| # | Escena | Qué se anima | Bloque de código |
| :-- | :--- | :--- | :--- |
| 1 | Agente mudo | Pantalla con error `503`, mensaje de usuario sin respuesta | — |
| 2 | Reintentos que saturan | Flechas repetidas hacia un servidor que se llena | — |
| 3 | Lista de modelos | Dos tarjetas: primario y respaldo | Sección 2 |
| 4 | Flujo de decisión | Diagrama de la sección 3 | Sección 3 |
| 5 | Códigos reintentables | Lista de `{429, 500, 502, 503, 504}` que se ilumina | Sección 4 |
| 6 | Configuración | Código con `retriable_status_codes` | Sección 4.3 |
| 7 | Respaldo con configuración propia | Código de instancia `Gemini` | Sección 5 |
| 8 | Streaming | Línea de tiempo: primer chunk y punto sin retorno | Sección 7 |
| 9 | Plan B final | Callback que responde con texto | Sección 9 |

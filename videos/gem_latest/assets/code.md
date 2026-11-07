# `gemini-flash-latest`: el alias que siempre apunta al Flash más reciente

Google expone `gemini-flash-latest` como un **alias mutable** (un placeholder de modelo).
No es un modelo fijo: en cada request, Google lo resuelve al **último Gemini Flash**
publicado (hoy puede ser `gemini-3.5-flash`; mañana, el siguiente).

## Qué problema resuelve

Antes, si tu app hardcodeaba un ID de versión (`gemini-2.5-flash`, `gemini-3-flash-preview`, etc.),
cada vez que Google lanzaba un Flash más potente tenías que:

1. Cambiar el string del modelo en el código
2. Hacer release / redeploy

Con `gemini-flash-latest` **no hace falta release**: el mismo string sigue válido y Google
redirige automáticamente al Flash más nuevo.

---

## Antes — Python · modelo pinneado

```python
from google.adk import Agent
from google.adk.tools import google_search

agent = Agent(
    name="researcher",
    model="gemini-2.5-flash",
    instruction="You help users research topics thoroughly.",
    tools=[google_search],
)
```

## Después — Python · alias `latest`

```python
from google.adk import Agent
from google.adk.tools import google_search

agent = Agent(
    name="researcher",
    model="gemini-flash-latest",
    instruction="You help users research topics thoroughly.",
    tools=[google_search],
)
```

## Diff canónico

```diff
- model="gemini-2.5-flash"
+ model="gemini-flash-latest"
```

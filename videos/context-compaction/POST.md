# Texto del post (LinkedIn)

**Video:** `context-compaction.mp4` (1080×1920, 93 s, subtítulos incrustados).
**Imagen:** `social/linkedin-context-compaction.png` (1200×627, 1.91:1, sin cara). Fuente editable: `social/linkedin/index.html`; se vuelve a generar con `pnpm exec hyperframes snapshot social/linkedin --at 0.5 --no-end -o social/linkedin/.out`.

---

Mis agentes de IA me estaban costando más de lo normal. Y había un culpable: yo, que no estaba manejando bien el contexto. 💸

Lo vi en la consola de Google Cloud: los costos estaban bastante elevados.

¿Por qué pasa?
Las APIs de los LLM no recuerdan nada entre llamadas. En cada mensaje le vuelves a mandar al modelo todo el historial: lo que escribió el usuario, lo que respondió el bot, cada tool call con su resultado y cada skill que cargaste.

A medida que el usuario chatea, el historial crece. Si tu agente usa herramientas y skills, crece mucho más rápido. Más contexto significa más tokens, y la factura de la API se dispara.

La solución es una práctica de ingeniería de contexto: Context Compaction.

→ Cuando la conversación llega a un límite, entra un modelo más ligero y barato, como Gemini Flash.
→ Resume los eventos viejos y las partes importantes de la conversación.
→ Las salidas pesadas de tools y skills que ya no aportan dejan de viajar en cada llamada.

El bot no pierde la memoria de lo que se habló, pero cada llamada pesa mucho menos.

En Google ADK se activa con EventsCompactionConfig y LlmEventSummarizer:

summarization_llm = Gemini(model="gemini-flash-latest")
my_summarizer = LlmEventSummarizer(llm=summarization_llm)

app = App(
    name='my-agent',
    root_agent=root_agent,
    events_compaction_config=EventsCompactionConfig(
        compaction_interval=3,
        overlap_size=1,
        summarizer=my_summarizer,
    ),
)

compaction_interval=3 compacta cada 3 invocaciones y overlap_size=1 conserva la última para no perder el hilo. Si prefieres dispararlo por tamaño, EventsCompactionConfig también acepta token_threshold.

El resultado: desde el release del 13 de octubre, mi facturación diaria bajó y ya no está en alta. Y las conversaciones siguen manteniendo su calidad.

Si tienes agentes en producción, revisa cuánto contexto mandas en cada llamada. Probablemente estás pagando por historial que tu modelo ya no necesita.

¿Tus agentes ya compactan el contexto o todavía mandan todo el historial? 👇

#IA #AgentesDeIA #GoogleADK #Gemini #LLM #ContextEngineering #DesarrolloDeSoftware

---

**Notas para publicar:**
- El código y los parámetros están verificados contra adk.dev/context/compaction (2026-10-22).
- El post no da un porcentaje de ahorro porque la captura de facturación no muestra montos. Si quieres una cifra (por ejemplo, el promedio diario antes y después del 13 de octubre), sácala de la consola de Google Cloud y agrégala después de "mi facturación diaria bajó".
- Música del video: borrador de MusicGen (pesos CC-BY-NC 4.0, no comercial). Si el post promociona un servicio o producto, reemplaza la pista antes de publicar.
- Fuente del texto: transcripción de la voz en off (`assets/vo/voiceover.words.json`) y del intro.

# REVIEW — context-compaction (2026-10-22)

Entregado: `renders/context-compaction.mp4` (1080×1920, 30 fps, 93,2 s, H.264 + AAC, calidad delivery).

## Ciclo de crítica (CLAUDE.md)

Revisado sobre `renders/draft.mp4` y después sobre el render final: 51 snapshots de beats, prueba de teléfono a 360 px (1 frame cada 3 s), tiras de 12 frames en las 9 costuras y medición de audio.

| Criterio | Pasada 1 | Final | Qué cambió |
| --- | --- | --- | --- |
| Gancho en 2 s | 8 | 8 | Cara, hook en cintas y billete con alas desde el frame 0 |
| Legibilidad en móvil | 7 | 8 | Punch-in ×1.5 al teléfono en la prueba de memoria (61,6–65,7 s) |
| Calidad de movimiento | 8 | 8 | — |
| Variedad | 8 | 8 | — |
| Composición | 8 | 8 | — |
| Marca / paper cut | 8 | 8 | — |
| Sincronía con el sonido | 6 | 8 | Voces normalizadas a −15 LUFS; mezcla final −15,8 LUFS, pico −1,5 dBFS |

Arreglados en la pasada 1 (P0): franja morada a la derecha en el intro (overflow del rasgado); consola a pantalla completa cortada a la mitad (polígono del split); flecha de resultados visible antes de tiempo; punto de la curva desplazado en la caída (escala de SVG con origen viejo).

## Decisiones creativas

- Paper cut como medio: cartulina #493A80 con fibra (textura generada con semilla), papel #F6F2E8, cinta negra, un acento amarillo #FFC72C. El papel se pega ("slap"), se arranca o se rasga; nunca hace fade.
- Tres rasgados de papel en las costuras (7,0 / 33,0 / 82,5 s). El resto de transiciones las causa un objeto en pantalla.
- El ejemplo que recorre el video es el pedido #4821: chat → tiras → RESUMEN → "El jueves, como te dije".
- Las barras de facturación son tu gráfico real, reconstruido en papel con alturas relativas medidas de la captura (sin montos, porque la captura no los muestra). Release el 13 oct (confirmado).
- Curva de tokens, recibo y tiras: valores ilustrativos.
- Código: tu snippet tal cual, más las dos líneas del `LlmEventSummarizer` verificadas en adk.dev.
- Sin CTA (pedido del usuario).

## Lo medido y lo que no

- Medido: duración, loudness (EBU R128), true peak, sin clipping, posición de los golpes (el pico de audio cae en la caída, 66,1 s).
- Mirado: frames, tiras y prueba de teléfono.
- **Nadie escuchó la mezcla**: el balance entre voz, música y SFX está medido, no oído.

## Lo más débil y qué haría con más tiempo

- 12,0–17,2 s: la columna derecha del escenario del chat queda vacía hasta "HISTORIAL".
- Las burbujas del chat (fuera de la prueba de memoria) quedan en ~10 px a 360 px de ancho; son ambiente, no texto a leer.
- La música es un borrador de MusicGen: su "apertura" en 66 s baja de energía en vez de subir; el riser y el impacto sostienen la caída.

## Avisos

- `lint`: 0 errores, 0 warnings.
- `check` completo no terminó dentro de su plazo en este film largo (`check_runtime_failure: deadline`); se validó con lint, snapshots y render.
- Música: pesos de MusicGen CC-BY-NC 4.0, **no comercial**. Opciones en `assets/music/track-s{1,2,3}.wav`; previews con la voz en `renders/review/music/opcion-{1,2,3}.mp3`. Va la 1.
- SFX CC0 / biblioteca de media-use: `assets/sfx/CREDITS.md`.
- Hallazgo técnico: en este runtime, los tweens de `clip-path` con ease no lineal y duración corta no avanzan al hacer seek. Por eso los rasgados usan transforms y los revelados usan `tl.set` escalonados (helpers `PC` en `index.html`).

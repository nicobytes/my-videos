# Videos

Cada subcarpeta es un **proyecto HyperFrames completo** (un video). Su estilo y su contenido están en su propio `BRIEF.md`.

| Carpeta |
| ------- |
| `booking/` |
| `cf-locations/` |
| `cloudflare-latency-motion-en/` |
| `effects/` |
| `fallback-model/` |
| `gem_latest/` |
| `office_hours/` |
| `parlana-spa/` |
| `pnpm12/` |
| `prices/` |
| `react/` |
| `whatsapp-tips/` |

## Comandos

Desde la raíz, para crear un video nuevo:

```bash
pnpm new-video <slug>
```

Dentro de un video (siempre `cd` antes):

```bash
cd videos/<slug>
pnpm run check
npx hyperframes preview --background
pnpm run render
```

Detalles en [SETUP.md](../SETUP.md).

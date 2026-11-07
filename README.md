# my-videos

Workspace de videos hechos con [HyperFrames](https://hyperframes.heygen.com): HTML que se renderiza a MP4. Cada video es un proyecto completo en `videos/<slug>/`, con su propio estilo.

Este repo guarda lo que define cada video: composiciones, guiones, briefs, storyboards y transcripts. **La media pesada (footage, voz, música) y los renders no están en git.** Para renderizar un video en otra PC hay que traer su media aparte (ver [La media](#la-media)).

## Empezar en una PC nueva

### 1. Requisitos

| Herramienta | Versión | Para qué |
| --- | --- | --- |
| Node.js | 22 o superior | CLI de HyperFrames |
| pnpm | 12 | Dependencias (el repo es un workspace de pnpm) |
| ffmpeg | cualquiera reciente, en el PATH | Render y media |
| uv | cualquiera reciente | Python para audio |
| git | | |

En Windows, trabaja dentro de WSL y clona en el disco de Linux (`~/...`), no en `/mnt/c/...`: es mucho más rápido y evita problemas de permisos.

### 2. Clonar e instalar

```bash
git clone git@github.com:nicobytes/my-videos.git
```

```bash
cd my-videos
```

```bash
pnpm install
```

```bash
pnpm exec playwright install chromium
```

```bash
npx hyperframes browser ensure
```

```bash
uv sync
```

`uv sync` instala torch para generar música con MusicGen (unos 4 GB). Si no lo necesitas o la máquina no tiene GPU, usa la instalación liviana (unos 400 MB):

```bash
uv sync --no-group musicgen
```

Con la instalación liviana, corre los scripts de Python con `uv run --no-group musicgen python ...`. Un `uv run` normal vuelve a instalar torch por su cuenta.

### 3. Instalar las skills del agente

Las skills le enseñan a Claude Code a trabajar con HyperFrames (`/hyperframes` y demás). Se instalan por máquina, así que hay que hacerlo en cada PC:

```bash
npx hyperframes skills
```

Después reinicia Claude Code para que las cargue.

### 4. Comprobar que todo funciona

```bash
npx hyperframes doctor
```

```bash
pnpm new-video prueba
```

```bash
cd videos/prueba && pnpm run check
```

Si `check` termina sin errores, la instalación está lista. Un warning `sweep_static` en el ejemplo en blanco es normal. Borra `videos/prueba/` al terminar.

### 5. Opcional, según la máquina

Agrégalo a tu `~/.zshrc` o `~/.bashrc` y ajusta la ruta del repo:

```bash
export HYPERFRAMES_PYTHON="$HOME/my-videos/.venv/bin/python"
```

- **WSL con GPU NVIDIA:** si el render dice `browserGpuMode probe → software`, sigue la nota de [SETUP.md](SETUP.md#problemas-comunes).
- **Transcripción:** `npx hyperframes transcribe` necesita `cmake` y un compilador de C la primera vez, y descarga el modelo `large-v3` (3,1 GB).
- **Renders largos:** si `/tmp` es un tmpfs pequeño, un render de varios minutos puede llenarlo. Manda las cachés al disco:

```bash
HYPERFRAMES_EXTRACT_CACHE_DIR=~/.cache/hyperframes/extract TMPDIR=~/.cache/hyperframes/tmp pnpm run render
```

## La media

Git solo guarda los archivos livianos. Esto **no** viaja con el repo:

| No está en git | Dónde va | Cómo se recupera |
| --- | --- | --- |
| Footage, voz y música | `videos/<slug>/assets/footage/`, `assets/vo/`, `assets/music/`, `assets/cut/`, `input-video.*`, `audio.mp3` | Cópialos desde tu respaldo (disco externo o nube) |
| Renders | `videos/<slug>/renders/` | `pnpm run render` |
| Dependencias | `node_modules/`, `.venv/` | Paso 2 |
| Modelos (whisper, MusicGen) | `~/.cache/` | Se descargan en el primer uso |

Para saber exactamente qué le falta a un video, corre el lint dentro de su carpeta. Los archivos ausentes aparecen como `missing_local_asset` (video) o `audio_src_not_found` (audio):

```bash
cd videos/<slug> && pnpm exec hyperframes lint
```

Copia esos archivos a la ruta que indica y vuelve a correr el lint hasta que no quede ninguno.

Antes de cambiar de PC, respalda la media de los videos que sigas editando: si solo existe en una máquina, no se puede recuperar desde este repo.

## Trabajar en un video

Crear uno nuevo, desde la raíz:

```bash
pnpm new-video <slug>
```

Dentro de `videos/<slug>/`:

| Comando | Qué hace |
| --- | --- |
| `pnpm run check` | Lint, runtime, layout, movimiento y contraste |
| `npx hyperframes preview --background` | Abre el preview en Studio (ciérralo con `--stop`) |
| `pnpm run render` | Renderiza el MP4 en `renders/` |
| `pnpm run publish` | Publica y da un enlace para compartir |

La versión de HyperFrames está fijada en el `package.json` de la raíz y la comparten todos los videos.

## Documentación

- [NUEVO_VIDEO.md](NUEVO_VIDEO.md): paso a paso para hacer un video, de la idea al render.
- [SETUP.md](SETUP.md): instalación en detalle y solución de problemas.
- [CLAUDE.md](CLAUDE.md): reglas del workspace para agentes y criterios de calidad.
- [videos/README.md](videos/README.md): comandos por video.

## Problemas conocidos

- **`cloudflare-latency-motion-en`:** necesita `assets/vendor/three-globe.bundle.js`, un bundle hecho a medida que no está en el repo. Hay que recuperarlo de un respaldo o reconstruirlo; `lint` no lo reporta. Si lo recuperas y quieres versionarlo, agrega una excepción en `.gitignore`, porque `vendor/` está ignorado.
- **`core.fileMode`:** si clonas en `/mnt/c/...` (WSL) git marcará todos los archivos como modificados por los permisos. Se evita con:

```bash
git config core.fileMode false
```

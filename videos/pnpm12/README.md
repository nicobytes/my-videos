# pnpm12

HyperFrames project for the pnpm 12 talking-head recut.

## Commands

Run these from **this directory** (`videos/pnpm12`):

```bash
pnpm run check
pnpm exec hyperframes preview --background
pnpm run render
```

From the workspace hub:

```bash
pnpm run pnpm12:check
pnpm run pnpm12:dev
pnpm run pnpm12:render
```

## Key files

| File | Role |
| ---- | ---- |
| `index.html` | Assembled composition |
| `STORYBOARD.md` | Narrative plan |
| `BRIEF.md` | Confirmed brief |
| `pnpm12.mp4` / `input-video.mp4` | Source footage |
| `captions.srt` | Caption timing |
| `assets/` | Logos + screens used on cards |
| `compositions/` | Caption gradient-fill sub-comp |
| `scripts/` | Assemble / patch helpers (optional rebuild) |

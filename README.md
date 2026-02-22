# Conan Exiles GeoGuessr (Fan Project)

A lightweight, open-source, browser game inspired by GeoGuessr, built for Conan Exiles.

## Current Scope

- Map pack: Exiled Lands
- Session length: 5 rounds
- Scoring: distance-based
- Hosting target: GitHub Pages (static site)

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Content Structure

- `assets/exiled-lands/map/exiled-lands-basemap.jpg`: main guess map
- `assets/exiled-lands/screenshots/`: round screenshots (`001.jpeg`, etc)
- `src/data/exiled-lands.json`: source of truth for locations and answer coordinates

## Coordinate Format

Coordinates are normalized:

- `x`: `0..1` from left to right
- `y`: `0..1` from top to bottom

Example:

```json
{
  "id": "el-001",
  "screenshot": "assets/exiled-lands/screenshots/001.jpeg",
  "answer": { "x": 0.547, "y": 0.445 },
  "metadata": {
    "biome": "highlands",
    "tags": ["poi", "ruins"],
    "poiType": "dungeon",
    "notes": "Optional freeform notes"
  }
}
```

## Coordinate Helper

Use the built-in coordinate helper to place accurate pins:

- Local: `http://localhost:5173/conan_exiles_geoguessr/?tool=coords`
- GitHub Pages: `https://dezmathio.github.io/conan_exiles_geoguessr/?tool=coords`

It supports zoom/pan, live hover coordinates, and copy helpers for direct JSON pasting.

## Metadata TODO (Future Themed Rounds)

- Add `metadata.biome` on every location.
- Add `metadata.tags` values like `poi`, `dungeon`, `hidden-base`, `camp`, `landmark`.
- Add `metadata.poiType` when relevant (`dungeon`, `obelisk`, `camp`, etc).
- Keep optional `metadata.notes` for creator context.
- Future mode idea: filter location pool by metadata for themed sessions.

## Disclaimer

This is an unofficial fan-made project. Conan Exiles and related assets/IP belong to Funcom.

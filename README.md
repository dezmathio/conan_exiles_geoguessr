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
- `assets/exiled-lands/screenshots/references/`: optional pin reference images (`001_pin.jpeg`, etc)
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
  "answer": { "x": 0.547, "y": 0.445 }
}
```

## SEO Notes

Replace `YOUR_GITHUB_USERNAME` in:

- `public/robots.txt`
- `public/sitemap.xml`

## Disclaimer

This is an unofficial fan-made project. Conan Exiles and related assets/IP belong to Funcom.

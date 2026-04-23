# stalkr

Stalkr ist ein Full-Stack Dashboard für einen Minecraft-Server.
Das Projekt besteht aus einem React/Vite-Frontend und einem Express/TypeScript-Backend.

## Übersicht

- `client`: React 19 + TypeScript + Vite
- `server`: Express 5 + TypeScript

Hauptfunktionen:

- Serverstatus und Spieleransicht im Dashboard
- Admin-Login per Passwort (JWT)
- Admin-Bereich mit Serversteuerung, Live-Logs und Konfiguration
- Einbettung einer Karte (BlueMap) im Frontend (`http://localhost:8100`)

## Projektstruktur

```text
stalkr/
  client/   # Frontend
  server/   # Backend API + Services
```

## Voraussetzungen

- Node.js 20+
- npm 10+
- Laufender Minecraft-Server inkl. RCON (für echte Serverdaten)
- Optional: BlueMap auf `http://localhost:8100`

## Installation

### 1) Dependencies installieren

```bash
cd server
npm install

cd ../client
npm install
```

### 2) Backend konfigurieren

In `server/.env` müssen mindestens diese Werte gesetzt sein:

- `PORT`
- `MC_HOST`
- `MC_RCON_PORT`
- `MC_RCON_PASSWORD`
- `MC_WORLD_PATH`
- `MC_USERCACHE_PATH`
- `JWT_SECRET`
- `ADMIN_PASSWORD`

Wichtig: Keine echten Secrets in Git committen.

## Entwicklung starten

### Backend

```bash
cd server
npm run dev
```

Standard-Port laut Code: `4000`

### Frontend

```bash
cd client
npm run dev
```

Vite startet standardmaessig auf `http://localhost:5173`.

## Build für Produktion

### Server

```bash
cd server
npm run build
npm start
```

### Client

```bash
cd client
npm run build
npm run preview
```

## API-Endpunkte (aktueller Stand)

Basis: `http://localhost:4000`

### Auth

- `POST /api/auth/login`

Body:

```json
{
  "password": "..."
}
```

Antwort:

```json
{
  "token": "<jwt>"
}
```

### Spieler

- `GET /api/players/status`
- `GET /api/players/:name/inventory`
- `GET /api/players/:name/data`

### Server

- `GET /api/server/server-info`
- `POST /api/server/control`
- `GET /api/server/logs`

Hinweis: Im Backend sind dieselben `serverroutes` zusaetzlich unter `/api/logs` und `/api/control` gemountet.

## Frontend-Routen

- `/` Dashboard
- `/login` Admin-Login
- `/admin` Admin-Seite (durch Token in `localStorage` geschützt)

## Aktueller Entwicklungsstatus

- In `client/src/api.ts` werden aktuell Mock-Daten für Dashboard/Spieler genutzt.
- Der Login ruft bereits das echte Backend (`/api/auth/login`) auf.
- Für vollstaendige Live-Daten muss die Frontend-API auf echte Endpunkte umgestellt werden.

## NPM Scripts

### client

- `npm run dev` - Vite Dev-Server
- `npm run build` - TypeScript Build + Vite Build
- `npm run lint` - ESLint
- `npm run preview` - Build lokal previewen

### server

- `npm run dev` - Nodemon + tsx
- `npm run build` - TypeScript kompilieren
- `npm start` - Kompiliertes Backend starten

## Troubleshooting

`401 Invalid password` beim Login:

- `ADMIN_PASSWORD` in `server/.env` prüfen
- Backend wirklich auf Port `4000` gestartet?

Fehler bei Spieler-/Serverdaten:

- RCON-Daten (`MC_HOST`, `MC_RCON_PORT`, `MC_RCON_PASSWORD`) prüfen
- Pfade `MC_WORLD_PATH` und `MC_USERCACHE_PATH` prüfen

Karte wird nicht angezeigt:

- BlueMap muss unter `http://localhost:8100` laufen

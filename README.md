# CityMirror — Digital Twin City

> Simulatore urbano AI open source per esplorare scenari di mobilità, servizi e quartieri su città reali.  
> Open-source AI urban simulator for exploring mobility, services, and neighborhood scenarios on real cities.

[![License: MIT](https://img.shields.io/badge/License-MIT-0a7b83.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff.svg)](https://vitejs.dev/)

### 🏷️ Tag & Keyword / Topics
`digital-twin` · `urban-planning` · `smart-city` · `ai-simulator` · `urban-simulation` · `15-minute-city` · `traffic-simulation` · `geojson` · `gis` · `ollama` · `open-source` · `react` · `typescript`

**Keywords:** simulatore urbano AI, digital twin city, open source urban planning, pianificazione mobilità, 15 minute neighborhood, simulazione traffico origine destinazione, import geojson, smart city dashboard.

---

CityMirror trasforma un obiettivo urbano in scenari confrontabili: griglia 2D, gerarchia stradale, stima di traffico con grafo origine-destinazione, popolazione, servizi, verde e parcheggi. È un MVP trasparente: le stime sono euristiche e **non** costituiscono progettazione urbanistica, strutturale o finanziaria professionale.

CityMirror turns an urban objective into comparable scenarios: 2D grid, road hierarchy, origin-destination traffic simulation, population, services, green space, and parking estimates. It is a transparent MVP: estimates are heuristic and **not** professional urban, structural, or financial planning advice.

## Avvio locale / Run locally

Prerequisito: Node.js 20 o successivo. / Prerequisite: Node.js 20 or later.

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

Apri l'indirizzo mostrato da Vite, normalmente `http://localhost:5173`. / Open the URL shown by Vite, normally `http://localhost:5173`.

Per una build di produzione: / For a production build:

```bash
npm run build
npm run preview
```

## Google Maps Platform (opzionale / optional)

Senza chiave l'app usa la griglia dimostrativa e resta pienamente esplorabile. Per cercare una città e visualizzare la mappa di riferimento, crea `.env` e aggiungi:

Without a key the app runs with the demonstrative grid and remains fully explorable. To search for a city and display its reference map, create `.env` and add:

```env
VITE_GOOGLE_MAPS_API_KEY=your_restricted_key
```

Abilita **Maps JavaScript API** e **Geocoding API**, limita la chiave agli origin del deploy e non committarla. I dati e le tiles di Google non vengono esportati, copiati o salvati dall'app: gli export contengono solo scenari CityMirror generati localmente.

Enable **Maps JavaScript API** and **Geocoding API**, restrict the key to deployment origins, and never commit it. Google data and map tiles are not exported, copied, or stored by the app: exports include only locally generated CityMirror scenarios.

## Funzionalità incluse / Included Features

- **Generatore di tre alternative** per qualsiasi obiettivo o richiesta urbana.
- **Import GIS / GeoJSON**: Caricamento di file `.geojson` con estrazione automatica dei confini e superficie in ettari.
- **Simulazione traffico origine-destinazione**: Calcolo deterministico tramite distanze su grafo (Manhattan distance) tra abitazioni, scuole, fermate e zone miste.
- **Integrazione LLM locali & Ollama**: Supporto diretto a endpoint Ollama (`/api/chat`, `/api/generate`) con robusto parser JSON strutturato.
- **Parametri di costo configurabili**: `SimulationConfig` personalizzabile per adeguarsi a valuta e costi comunali al m²/abitante.
- **Griglia 2D interattiva** con zone residenziali, parchi, servizi e gerarchia stradale primaria/locale.
- **Metriche e indicatori**: stime leggibili di traffico, costo, verde per abitante, posti auto e accessibilità.
- **Confronto e fasi**: comparazione rapida tra scenari e proposta di cronoprogramma a fasi.
- **Export dei dati**: esportazione dello scenario attivo in JSON e standard GeoJSON.
- **Bilingue & responsive**: interfaccia italiano/English, tema accessibile, funzionamento statico e deploy immediato.

## Architettura / Architecture

```text
Browser (React + TypeScript)
 ├─ GIS parser: GeoJSON → calcolo bounding box + ettari
 ├─ Urban engine: brief → simulazione grafo OD → 3 scenari + indicatori + GeoJSON
 ├─ Local AI adapter (Ollama / endpoint custom): prompt vincolato → fallback locale
 ├─ Optional Google Maps adapter: city geocoding + contextual map
 └─ Export: CityMirror JSON / GeoJSON (generated design only)
```

Il motore è deliberatamente deterministico e verificabile. Un endpoint AI compatibile (come Ollama in locale) può essere collegato tramite `VITE_AI_ENDPOINT`, mantenendo il motore algoritmico locale come fallback affidabile e istantaneo.

The engine is intentionally deterministic and reviewable. A compatible AI endpoint (e.g. local Ollama) can be connected through `VITE_AI_ENDPOINT`, retaining the local algorithmic engine as a reliable, zero-latency fallback.

## Deploy / Deployment

Essendo una SPA statica, `npm run build` genera `dist/`, pubblicabile su GitHub Pages, Netlify, Vercel, Cloudflare Pages o un web server. Configura `VITE_GOOGLE_MAPS_API_KEY` come variabile d'ambiente di build del provider e autorizza il dominio nel progetto Google Cloud.

As a static SPA, `npm run build` creates `dist/`, suitable for GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any web server. Configure `VITE_GOOGLE_MAPS_API_KEY` as the host build environment variable and authorize the domain in Google Cloud.

## Roadmap / Roadmap

- [x] **Import GIS pubblico (GeoJSON)**: calcolo confini reali e superficie del lotto.
- [x] **Simulazione a grafo con origine-destinazione**: calcolo percorsi e penalità di traffico.
- [x] **Collegamento a modello AI open source via Ollama** con estrazione JSON tollerante.
- [x] **Calibratura parametri e costi locali** (`SimulationConfig`).
- [ ] Integrazione OpenStreetMap / Overpass API diretta per estrazione automatica geometrie urbane.
- [ ] Modelli di trasporto pubblico avanzati (isocrone pedonali e ciclabili).

## Licenza e attribuzioni / License and attribution

Codice MIT, copyright 2026 MRJonam91. Consulta [`LICENSE`](./LICENSE) e [`COPYRIGHT_NOTICE.md`](./COPYRIGHT_NOTICE.md). Google Maps è facoltativo e soggetto ai propri termini.

MIT-licensed code, copyright 2026 MRJonam91. See [`LICENSE`](./LICENSE) and [`COPYRIGHT_NOTICE.md`](./COPYRIGHT_NOTICE.md). Google Maps is optional and governed by its own terms.

# CityMirror — Digital Twin City

> Open-source AI urban simulator for exploring mobility, services, and neighborhood scenarios on real cities.  
> *Simulatore urbano AI open source per esplorare scenari di mobilità, servizi e quartieri su città reali.*

[![License: MIT](https://img.shields.io/badge/License-MIT-0a7b83.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff.svg)](https://vitejs.dev/)

---

### 🌐 Languages / Lingue
**[ 🇬🇧 English ](#-citymirror--english)** &nbsp;|&nbsp; **[ 🇮🇹 Italiano ](#-citymirror--italiano)** &nbsp;|&nbsp; **[ 📖 Leggi in Italiano (README.it.md)](./README.it.md)**

---

## 🇬🇧 CityMirror — English

### 🏷️ Tags & Keywords
`digital-twin` · `urban-planning` · `smart-city` · `ai-simulator` · `urban-simulation` · `15-minute-city` · `traffic-simulation` · `geojson` · `gis` · `ollama` · `open-source` · `react` · `typescript`

**Keywords:** AI urban simulator, open-source digital twin, mobility planning, 15-minute city scenarios, origin-destination traffic simulation, GeoJSON boundaries, smart city modeling.

---

CityMirror turns an urban objective into comparable scenarios: 2D grid, road hierarchy, origin-destination traffic simulation, population, services, green space, and parking estimates. It is a transparent MVP: estimates are heuristic and **not** professional urban, structural, or financial planning advice.

### Quick Start / Run Locally

Prerequisite: Node.js 20 or later.

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

For a production build:

```bash
npm run build
npm run preview
```

### Google Maps Platform (Optional)

Without a key the app runs with the demonstrative grid and remains fully explorable. To search for a city and display its reference map, create `.env` and add:

```env
VITE_GOOGLE_MAPS_API_KEY=your_restricted_key
```

Enable **Maps JavaScript API** and **Geocoding API**, restrict the key to deployment origins, and never commit it. Google data and map tiles are not exported, copied, or stored by the app: exports include only locally generated CityMirror scenarios.

### Local AI & Ollama Integration (Optional)

CityMirror connects with local LLMs (e.g. Llama 3) via Ollama:

```env
VITE_AI_ENDPOINT=http://localhost:11434/api/chat
VITE_OLLAMA_MODEL=llama3
```

The client submits a constrained prompt requesting a strict JSON schema, with automatic JSON block extraction and an instant fallback to the local deterministic engine.

### Included Features

- **Three-Alternative Generator**: Generates three distinct urban proposals for any brief.
- **GIS / GeoJSON Import**: Upload `.geojson` site boundaries with automated boundary calculation and area extraction in hectares.
- **Origin-Destination Traffic Simulation**: Deterministic Manhattan distance calculation on street graphs connecting housing, schools, stations, and mixed-use blocks.
- **Local LLM & Ollama Integration**: Native integration with Ollama endpoints with structured JSON prompt engineering.
- **Configurable Cost Parameters**: `SimulationConfig` to calibrate municipal per-resident and per-hectare infrastructure costs.
- **Interactive 2D Grid**: Visual layout with residential units, parks, amenities, and primary/local street networks.
- **Metrics & Indicators**: Readable estimates for peak traffic, cost, green space per capita, parking, and service access.
- **Scenario Comparison & Phasing**: Side-by-side alternative comparison and step-by-step rollout schedule.
- **Data Export**: Export the active design in both CityMirror JSON and standardized GeoJSON format.
- **Bilingual & Responsive**: Italian and English interface, accessible theme, static operation, and fast deployment.

### Architecture

```text
Browser (React + TypeScript)
 ├─ GIS Parser: GeoJSON → bounding box + hectare calculation
 ├─ Urban Engine: brief → OD graph simulation → 3 scenarios + indicators + GeoJSON
 ├─ Local AI Adapter (Ollama / custom endpoint): constrained JSON prompt → local fallback
 ├─ Optional Google Maps Adapter: city geocoding + contextual map
 └─ Export: CityMirror JSON / GeoJSON (generated design only)
```

The engine is intentionally deterministic and reviewable. A compatible AI endpoint (e.g. local Ollama) can be connected through `VITE_AI_ENDPOINT`, retaining the local algorithmic engine as a reliable, zero-latency fallback.

### Deployment

As a static SPA, `npm run build` creates `dist/`, suitable for GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any web server. Configure `VITE_GOOGLE_MAPS_API_KEY` as the host build environment variable and authorize the domain in Google Cloud.

### Roadmap

- [x] **Public GIS import (GeoJSON)**: real site boundaries and hectare area calculation.
- [x] **Graph-based origin-destination simulation**: route distance and traffic penalty modeling.
- [x] **Open-source AI connection via Ollama** with robust JSON fallback extraction.
- [x] **Local parameters and cost calibration** (`SimulationConfig`).
- [ ] **Direct OpenStreetMap / Overpass API integration** for automated urban geometry extraction.
- [ ] **Advanced transit modeling** (walkable and cycling isochrone contours).

### License & Attribution

MIT-licensed code, copyright 2026 MRJonam91. See [`LICENSE`](./LICENSE) and [`COPYRIGHT_NOTICE.md`](./COPYRIGHT_NOTICE.md). Google Maps is optional and governed by its own terms.

---

## 🇮🇹 CityMirror — Italiano

### 🏷️ Tag & Keyword
`digital-twin` · `urban-planning` · `smart-city` · `ai-simulator` · `urban-simulation` · `15-minute-city` · `traffic-simulation` · `geojson` · `gis` · `ollama` · `open-source` · `react` · `typescript`

**Keywords:** simulatore urbano AI, digital twin city, open source urban planning, pianificazione mobilità quartiere 15 minuti, simulazione traffico origine destinazione, import geojson, smart city dashboard.

---

CityMirror trasforma un obiettivo urbano in scenari confrontabili: griglia 2D, gerarchia stradale, stima di traffico con grafo origine-destinazione, popolazione, servizi, verde e parcheggi. È un MVP trasparente: le stime sono euristiche e **non** costituiscono progettazione urbanistica, strutturale o finanziaria professionale.

### Avvio locale

Prerequisito: Node.js 20 o successivo.

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

Apri l'indirizzo mostrato da Vite, normalmente `http://localhost:5173`.

Per una build di produzione:

```bash
npm run build
npm run preview
```

### Google Maps Platform (opzionale)

Senza chiave l'app usa la griglia dimostrativa e resta pienamente esplorabile. Per cercare una città e visualizzare la mappa di riferimento, crea `.env` e aggiungi:

```env
VITE_GOOGLE_MAPS_API_KEY=your_restricted_key
```

Abilita **Maps JavaScript API** e **Geocoding API**, limita la chiave agli origin del deploy e non committarla. I dati e le tiles di Google non vengono esportati, copiati o salvati dall'app: gli export contengono solo scenari CityMirror generati localmente.

### Integrazione AI locale & Ollama (opzionale)

CityMirror supporta modelli LLM eseguiti in locale (es. Llama 3) tramite Ollama:

```env
VITE_AI_ENDPOINT=http://localhost:11434/api/chat
VITE_OLLAMA_MODEL=llama3
```

Il client invia un system prompt vincolato con estrazione tollerante del JSON e fallback automatico sul motore locale deterministico.

### Funzionalità incluse

- **Generatore di tre alternative** per qualsiasi obiettivo o richiesta urbana.
- **Import GIS / GeoJSON**: Caricamento file `.geojson` con estrazione confini e superficie in ettari.
- **Simulazione traffico origine-destinazione**: Calcolo deterministico tramite distanze su grafo (distanza Manhattan) tra abitazioni, scuole, fermate e zone miste.
- **Integrazione LLM locali & Ollama**: Supporto nativo a endpoint Ollama (`/api/chat`, `/api/generate`) con prompt strutturato e tollerante.
- **Parametri di costo configurabili**: `SimulationConfig` personalizzabile per adeguarsi a valuta e costi comunali al m²/abitante.
- **Griglia 2D interattiva** con zone residenziali, parchi, servizi e gerarchia stradale primaria/locale.
- **Metriche e indicatori**: stime leggibili di traffico, costo, verde per abitante, posti auto e accessibilità.
- **Confronto e fasi**: comparazione rapida tra scenari e proposta di cronoprogramma a fasi.
- **Export dei dati**: esportazione dello scenario attivo in JSON e standard GeoJSON.
- **Bilingue & responsive**: interfaccia italiano/English, tema accessibile, funzionamento statico e deploy immediato.

### Architettura

```text
Browser (React + TypeScript)
 ├─ GIS parser: GeoJSON → calcolo bounding box + ettari
 ├─ Urban engine: brief → simulazione grafo OD → 3 scenari + indicatori + GeoJSON
 ├─ Local AI adapter (Ollama / endpoint custom): prompt vincolato → fallback locale
 ├─ Optional Google Maps adapter: city geocoding + contextual map
 └─ Export: CityMirror JSON / GeoJSON (generated design only)
```

Il motore è deliberatamente deterministico e verificabile. Un endpoint AI compatibile (come Ollama in locale) può essere collegato tramite `VITE_AI_ENDPOINT`, mantenendo il motore algoritmico locale come fallback affidabile e istantaneo.

### Deploy

Essendo una SPA statica, `npm run build` genera `dist/`, pubblicabile su GitHub Pages, Netlify, Vercel, Cloudflare Pages o un web server. Configura `VITE_GOOGLE_MAPS_API_KEY` come variabile d'ambiente di build del provider e autorizza il dominio nel progetto Google Cloud.

### Roadmap

- [x] **Import GIS pubblico (GeoJSON)**: calcolo confini reali e superficie del lotto.
- [x] **Simulazione a grafo con origine-destinazione**: calcolo percorsi e penalità di traffico.
- [x] **Collegamento a modello AI open source via Ollama** con estrazione JSON tollerante.
- [x] **Calibratura parametri e costi locali** (`SimulationConfig`).
- [ ] **Integrazione OpenStreetMap / Overpass API diretta** per estrazione automatica geometrie urbane.
- [ ] **Modelli di trasporto pubblico avanzati** (isocrone pedonali e ciclabili).

### Licenza e attribuzioni

Codice MIT, copyright 2026 MRJonam91. Consulta [`LICENSE`](./LICENSE) e [`COPYRIGHT_NOTICE.md`](./COPYRIGHT_NOTICE.md). Google Maps è facoltativo e soggetto ai propri termini.

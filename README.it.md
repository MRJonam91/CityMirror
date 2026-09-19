# CityMirror — Digital Twin City (Italiano)

> Simulatore urbano AI open source per esplorare scenari di mobilità, servizi e quartieri su città reali.

[![License: MIT](https://img.shields.io/badge/License-MIT-0a7b83.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff.svg)](https://vitejs.dev/)

[🇬🇧 Read in English (README.md)](./README.md)

---

### 🏷️ Tag & Keyword / Topics
`digital-twin` · `urban-planning` · `smart-city` · `ai-simulator` · `urban-simulation` · `15-minute-city` · `traffic-simulation` · `geojson` · `gis` · `ollama` · `open-source` · `react` · `typescript`

**Keywords:** simulatore urbano AI, digital twin city, open source urban planning, pianificazione mobilità quartiere 15 minuti, simulazione traffico origine destinazione, import geojson, smart city dashboard.

---

CityMirror trasforma un obiettivo urbano in scenari confrontabili: griglia 2D, gerarchia stradale, stima di traffico con grafo origine-destinazione, popolazione, servizi, verde e parcheggi. È un MVP trasparente: le stime sono euristiche e **non** costituiscono progettazione urbanistica, strutturale o finanziaria professionale.

## Avvio locale

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

## Google Maps Platform (opzionale)

Senza chiave l'app usa la griglia dimostrativa e resta pienamente esplorabile. Per cercare una città e visualizzare la mappa di riferimento, crea `.env` e aggiungi:

```env
VITE_GOOGLE_MAPS_API_KEY=your_restricted_key
```

Abilita **Maps JavaScript API** e **Geocoding API**, limita la chiave agli origin del deploy e non committarla. I dati e le tiles di Google non vengono esportati, copiati o salvati dall'app: gli export contengono solo scenari CityMirror generati localmente.

## Integrazione AI locale & Ollama (opzionale)

CityMirror supporta modelli LLM open source in locale (es. Llama 3) tramite Ollama:

```env
VITE_AI_ENDPOINT=http://localhost:11434/api/chat
VITE_OLLAMA_MODEL=llama3
```

Il client invia un prompt con vincolo JSON e adotta un parsing tollerante con fallback automatico sul motore algoritmico locale.

## Funzionalità incluse

- **Generatore di tre alternative** per qualsiasi obiettivo o richiesta urbana.
- **Import GIS / GeoJSON**: Caricamento di file `.geojson` con estrazione automatica dei confini e superficie del lotto in ettari.
- **Simulazione traffico origine-destinazione**: Calcolo deterministico su grafo con distanze di Manhattan tra residenze, scuole, stazioni e zone miste.
- **Integrazione LLM locali & Ollama**: Supporto diretto a endpoint Ollama (`/api/chat`, `/api/generate`) con robusto parser JSON strutturato.
- **Parametri di costo configurabili**: `SimulationConfig` personalizzabile per adeguarsi a valuta e costi comunali al m²/abitante.
- **Griglia 2D interattiva** con zone residenziali, parchi, servizi e gerarchia stradale primaria/locale.
- **Metriche e indicatori**: stime leggibili di traffico, costo, verde per abitante, posti auto e accessibilità.
- **Confronto e fasi**: comparazione rapida tra scenari e proposta di cronoprogramma a fasi.
- **Export dei dati**: esportazione dello scenario attivo in JSON e standard GeoJSON.
- **Bilingue & responsive**: interfaccia italiano/English, tema accessibile, funzionamento statico e deploy immediato.

## Architettura

```text
Browser (React + TypeScript)
 ├─ GIS parser: GeoJSON → calcolo bounding box + ettari
 ├─ Urban engine: brief → simulazione grafo OD → 3 scenari + indicatori + GeoJSON
 ├─ Local AI adapter (Ollama / endpoint custom): prompt vincolato → fallback locale
 ├─ Optional Google Maps adapter: city geocoding + contextual map
 └─ Export: CityMirror JSON / GeoJSON (generated design only)
```

Il motore è deliberatamente deterministico e verificabile. Un endpoint AI compatibile (come Ollama in locale) può essere collegato tramite `VITE_AI_ENDPOINT`, mantenendo il motore algoritmico locale come fallback affidabile e istantaneo.

## Deploy

Essendo una SPA statica, `npm run build` genera `dist/`, pubblicabile su GitHub Pages, Netlify, Vercel, Cloudflare Pages o un web server. Configura `VITE_GOOGLE_MAPS_API_KEY` come variabile d'ambiente di build del provider e autorizza il dominio nel progetto Google Cloud.

## Roadmap

- [x] **Import GIS pubblico (GeoJSON)**: calcolo confini reali e superficie del lotto.
- [x] **Simulazione a grafo con origine-destinazione**: calcolo percorsi e penalità di traffico.
- [x] **Collegamento a modello AI open source via Ollama** con estrazione JSON tollerante.
- [x] **Calibratura parametri e costi locali** (`SimulationConfig`).
- [ ] Integrazione OpenStreetMap / Overpass API diretta per estrazione automatica geometrie urbane.
- [ ] Modelli di trasporto pubblico avanzati (isocrone pedonali e ciclabili).

## Licenza e attribuzioni

Codice MIT, copyright 2026 MRJonam91. Consulta [`LICENSE`](./LICENSE) e [`COPYRIGHT_NOTICE.md`](./COPYRIGHT_NOTICE.md). Google Maps è facoltativo e soggetto ai propri termini.

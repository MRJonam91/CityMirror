# Contratto AI futuro / Future AI contract

L'MVP usa un generatore locale deterministico così che gli scenari rimangano verificabili senza credenziali. Un backend AI potrà sostituire o arricchire le proposte, ma dovrà restituire dati validabili e conservare l'export locale.

The MVP uses a deterministic local generator so scenarios remain reviewable without credentials. An AI backend may replace or enrich proposals, but it must return validatable data and preserve local export.

## Chiamata / Request

Configurare `VITE_AI_ENDPOINT` con un endpoint HTTPS sotto il proprio controllo. Il client invia una `POST` JSON con `brief`, `language` e `responseFormat: "citymirror-v1"`. Non inserire una chiave segreta di provider AI in una variabile `VITE_*`.

Configure `VITE_AI_ENDPOINT` with an HTTPS endpoint under your control. The client sends a JSON `POST` with `brief`, `language`, and `responseFormat: "citymirror-v1"`. Never put an AI-provider secret in a `VITE_*` variable.

## Input minimo / Minimum input

```json
{
  "city": "Roma, Italia",
  "population": 10000,
  "areaHa": 80,
  "priorities": ["Minimum traffic", "Green space"]
}
```

## Output richiesto / Required output

Restituire esattamente tre scenari, ciascuno con `title`, `narrative`, `tradeoffs`, `phases`, indicatori numerici e feature GeoJSON-like. Il client deve validare i limiti numerici, etichettare la fonte come AI e mantenere un fallback locale.

Return exactly three scenarios in `{ "scenarios": [...] }`, each with `id`, `title`, `subtitle`, `narrative`, `tradeoffs`, `phases`, `indicators`, numeric scores, and GeoJSON-like `features`. The client validates the outer shape and retains a local fallback if the call fails.

### Implementazione open source suggerita / Suggested open-source implementation

Un piccolo servizio Node/Python può orchestrare un modello locale via Ollama e applicare schema validation prima della risposta. Questo consente di tenere le credenziali lato server e di cambiare modello senza modificare la SPA.

A small Node/Python service can orchestrate a local model through Ollama and apply schema validation before responding. This keeps credentials server-side and allows model changes without changing the SPA.

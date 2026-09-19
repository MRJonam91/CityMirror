import { useMemo, useState } from 'react'
import { GoogleMap } from './GoogleMap'
import { geocodeCity } from './google'
import type { CityResult, Language, Scenario, UrbanBrief } from './types'
import { createScenarios, scenarioGeoJson } from './urban-engine'
import { requestAiScenarios } from './ai'
import { parseGeoJsonArea } from './gis-parser'

const copy = {
  it: {
    eyebrow: 'DIGITAL TWIN CITY', title: 'Immagina la prossima', accent: 'mossa urbana.',
    intro: 'Trasforma un obiettivo di quartiere in tre scenari chiari, comparabili e pronti per la discussione.',
    city: 'Città o area', population: 'Abitanti previsti', area: 'Area disponibile (ha)', priorities: 'Priorità del progetto', generate: 'Genera 3 scenari', generating: 'Elaborazione…', uploadGeoJson: 'Carica lotto (GeoJSON)',
    map: 'Schema urbano', realMap: 'Contesto cittadino', scenarios: 'Alternative proposte', compare: 'Confronta', active: 'Scenario attivo', details: 'Analisi dello scenario', benefits: 'Vantaggi e limiti', phases: 'Fasi suggerite',
    exportJson: 'Esporta JSON', exportGeo: 'Esporta GeoJSON', noKey: 'Modalità demo: la mappa di Google è facoltativa.',
    prioritiesList: ['Traffico minimo', 'Spazio verde', 'Servizi vicini', 'Trasporto pubblico'],
    example: 'Prova: “Progetta un quartiere da 10.000 abitanti con traffico minimo, scuola, parco e stazione.”',
    cityFound: 'Area di riferimento:', error: 'Città non trovata. La simulazione continua con lo scenario locale.',
  },
  en: {
    eyebrow: 'DIGITAL TWIN CITY', title: 'Imagine the next', accent: 'urban move.',
    intro: 'Turn a neighborhood objective into three clear, comparable scenarios ready for discussion.',
    city: 'City or area', population: 'Planned residents', area: 'Available area (ha)', priorities: 'Project priorities', generate: 'Generate 3 scenarios', generating: 'Working…', uploadGeoJson: 'Upload lot (GeoJSON)',
    map: 'Urban diagram', realMap: 'City context', scenarios: 'Proposed alternatives', compare: 'Compare', active: 'Active scenario', details: 'Scenario analysis', benefits: 'Benefits and trade-offs', phases: 'Suggested phases',
    exportJson: 'Export JSON', exportGeo: 'Export GeoJSON', noKey: 'Demo mode: Google map is optional.',
    prioritiesList: ['Minimum traffic', 'Green space', 'Nearby services', 'Public transport'],
    example: 'Try: “Design a 10,000-resident neighborhood with minimal traffic, a school, park, and station.”',
    cityFound: 'Reference area:', error: 'City not found. The simulation continues with a local scenario.',
  },
} as const

const initialBrief: UrbanBrief = { city: 'Roma, Italia', population: 10000, areaHa: 80, priorities: ['Traffico minimo', 'Spazio verde'] }

function download(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

function UrbanGrid({ scenario }: { scenario: Scenario }) {
  return <div className="urban-grid" aria-label={scenario.title}>
    {scenario.features.map((feature) => <div key={feature.id} className={`feature ${feature.kind}`} style={{ left: `${feature.x}%`, top: `${feature.y}%`, width: `${feature.width}%`, height: `${feature.height}%` }}>
      {feature.label && <span>{feature.label}</span>}
    </div>)}
    <div className="grid-note">CityMirror / {scenario.title}</div>
  </div>
}

export default function App() {
  const [language, setLanguage] = useState<Language>('it')
  const [brief, setBrief] = useState<UrbanBrief>(initialBrief)
  const [active, setActive] = useState(0)
  const [city, setCity] = useState<CityResult | null>(null)
  const [notice, setNotice] = useState('')
  const [working, setWorking] = useState(false)
  const [aiScenarios, setAiScenarios] = useState<Scenario[] | null>(null)
  const localScenarios = useMemo(() => createScenarios(brief, language), [brief, language])
  const scenarios = aiScenarios ?? localScenarios
  const selected = scenarios[active]
  const t = copy[language]

  const updatePriority = (priority: string) => setBrief((current) => ({ ...current, priorities: current.priorities.includes(priority) ? current.priorities.filter((item) => item !== priority) : [...current.priorities, priority] }))
  
  const handleGeoJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        const parsed = parseGeoJsonArea(json)
        if (parsed) {
          setBrief(b => ({ ...b, areaHa: parsed.areaHa }))
        }
      } catch (err) {
        console.error('Invalid GeoJSON', err)
      }
    }
    reader.readAsText(file)
  }

  const generate = async () => {
    setWorking(true)
    setNotice('')
    setActive(0)
    let noticeText = ''
    try {
      const proposals = await requestAiScenarios(brief, language)
      setAiScenarios(proposals)
    } catch {
      setAiScenarios(null)
      noticeText = language === 'it' ? 'Endpoint AI non disponibile: uso il motore locale.' : 'AI endpoint unavailable: using the local engine.'
    }
    try {
      const result = await geocodeCity(brief.city)
      if (result) setCity(result)
      else if (import.meta.env.VITE_GOOGLE_MAPS_API_KEY && !noticeText) noticeText = t.error
    } catch { if (!noticeText) noticeText = t.error }
    finally {
      setNotice(noticeText)
      setWorking(false)
    }
  }

  return <main>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="CityMirror">CITY<span>MIRROR</span></a>
      <div className="topbar-actions"><span className="status"><i /> {language === 'it' ? 'Motore locale attivo' : 'Local engine active'}</span><button className="language" onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}>{language === 'it' ? 'EN' : 'IT'}</button></div>
    </header>

    <section className="hero" id="top">
      <div><p className="eyebrow">{t.eyebrow}</p><h1>{t.title} <em>{t.accent}</em></h1><p className="intro">{t.intro}</p></div>
      <div className="hero-stat"><strong>3</strong><span>{language === 'it' ? 'alternative generate per ogni piano' : 'alternatives generated for every plan'}</span></div>
    </section>

    <section className="brief-card" aria-label="Urban brief">
      <div className="input-field wide"><label htmlFor="city">{t.city}</label><input id="city" value={brief.city} onChange={(event) => setBrief({ ...brief, city: event.target.value })} /></div>
      <div className="input-field"><label htmlFor="population">{t.population}</label><input id="population" type="number" min="100" value={brief.population} onChange={(event) => setBrief({ ...brief, population: Number(event.target.value) })} /></div>
      <div className="input-field"><label htmlFor="area">{t.area}</label><input id="area" type="number" min="1" value={brief.areaHa} onChange={(event) => setBrief({ ...brief, areaHa: Number(event.target.value) })} /></div>
      <div className="input-field wide"><label htmlFor="geojson">{t.uploadGeoJson}</label><input id="geojson" type="file" accept=".geojson,application/geo+json,application/json" onChange={handleGeoJson} /></div>
      <fieldset><legend>{t.priorities}</legend><div className="chips">{t.prioritiesList.map((priority) => <button key={priority} type="button" className={brief.priorities.includes(priority) ? 'chip selected' : 'chip'} onClick={() => updatePriority(priority)}>{priority}</button>)}</div></fieldset>
      <button className="generate" onClick={generate} disabled={working}>{working ? t.generating : t.generate} <span>→</span></button>
    </section>
    <p className="helper">{notice || t.example}</p>

    <section className="workspace">
      <article className="map-card"><div className="section-title"><div><p className="eyebrow">01 / {t.active}</p><h2>{selected.title}</h2></div><span className="score">{selected.score}<small>/100</small></span></div><UrbanGrid scenario={selected} /><div className="legend"><span><i className="legend-housing" />{language === 'it' ? 'Residenze' : 'Homes'}</span><span><i className="legend-park" />{language === 'it' ? 'Verde' : 'Green'}</span><span><i className="legend-service" />{language === 'it' ? 'Servizi' : 'Services'}</span><span><i className="legend-road" />{language === 'it' ? 'Strade' : 'Roads'}</span></div></article>
      <article className="context-card"><div className="section-title"><div><p className="eyebrow">02 / {t.realMap}</p><h2>{city?.name ?? brief.city}</h2></div></div><GoogleMap city={city} language={language} /><p className="context-caption">{city ? `${t.cityFound} ${city.name}` : t.noKey}</p></article>
    </section>

    <section className="alternatives"><div className="section-title"><div><p className="eyebrow">03 / {t.compare}</p><h2>{t.scenarios}</h2></div></div><div className="scenario-list">{scenarios.map((scenario, index) => <button key={scenario.id} className={index === active ? 'scenario-card active' : 'scenario-card'} onClick={() => setActive(index)}><span className="scenario-number">0{index + 1}</span><strong>{scenario.title}</strong><small>{scenario.subtitle}</small><div><span>{scenario.traffic}/100 {language === 'it' ? 'traffico' : 'traffic'}</span><b>{scenario.score}</b></div></button>)}</div></section>

    <section className="analysis"><article><p className="eyebrow">04 / {t.details}</p><h2>{selected.title}</h2><p className="narrative">{selected.narrative}</p><div className="indicator-grid">{selected.indicators.map((indicator) => <div className="indicator" key={indicator.label}><span>{indicator.label}</span><strong className={indicator.tone}>{indicator.value}</strong></div>)}</div></article><article className="tradeoffs"><p className="eyebrow">05 / {t.benefits}</p>{selected.tradeoffs.map((item) => <p key={item}>{item}</p>)}<p className="eyebrow phases-title">06 / {t.phases}</p><ol>{selected.phases.map((phase) => <li key={phase}>{phase}</li>)}</ol><div className="export-actions"><button onClick={() => download(`${selected.id}.json`, { brief, scenario: selected, generatedAt: new Date().toISOString() })}>{t.exportJson}</button><button onClick={() => download(`${selected.id}.geojson`, scenarioGeoJson(selected))}>{t.exportGeo}</button></div></article></section>

    <footer><span>© 2026 MRJonam91 · MIT License</span><span>CityMirror is a planning exploration tool, not professional advice.</span></footer>
  </main>
}

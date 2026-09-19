import type { Language, MapFeature, Scenario, UrbanBrief } from './types'

type Copy = {
  names: [string, string, string]
  subtitles: [string, string, string]
  narratives: [string, string, string]
  tradeoffs: [[string, string], [string, string], [string, string]]
  phases: [string, string, string]
  labels: { traffic: string; cost: string; green: string; parking: string; service: string; score: string }
  featureLabels: { homes: string; park: string; school: string; station: string; mixed: string }
}

const text: Record<Language, Copy> = {
  it: {
    names: ['Città dei 15 minuti', 'Corridoio verde', 'Hub connesso'],
    subtitles: ['Servizi vicini e mobilità attiva', 'Più suolo permeabile e meno auto', 'Trasporto pubblico come asse principale'],
    narratives: [
      'Blocchi compatti, scuola e parco al centro: la rete locale riduce gli attraversamenti non necessari.',
      'Un parco lineare collega le residenze ai servizi, liberando spazio per alberi, drenaggio e percorsi ciclabili.',
      'La stazione e gli usi misti sono concentrati sull’asse principale per intercettare gli spostamenti quotidiani.',
    ],
    tradeoffs: [
      ['Pro: servizi raggiungibili a piedi', 'Contro: densità maggiore nelle aree centrali'],
      ['Pro: massimo verde e comfort climatico', 'Contro: minore superficie edificabile'],
      ['Pro: minor pressione automobilistica', 'Contro: richiede frequenza del trasporto pubblico'],
    ],
    phases: ['Definire la maglia stradale e le reti', 'Realizzare parco, scuola e servizi', 'Completare residenze e monitorare traffico'],
    labels: { traffic: 'Traffico di punta', cost: 'Costo stimato', green: 'Verde per abitante', parking: 'Posti auto', service: 'Servizi a 10 min', score: 'Punteggio' },
    featureLabels: { homes: 'Residenze', park: 'Parco', school: 'Scuola', station: 'Stazione', mixed: 'Usi misti' },
  },
  en: {
    names: ['15-minute neighborhood', 'Green corridor', 'Connected hub'],
    subtitles: ['Nearby services and active mobility', 'More permeable land and fewer cars', 'Public transit as the main spine'],
    narratives: [
      'Compact blocks, school, and park at the center: the local network reduces unnecessary through traffic.',
      'A linear park connects homes to services, making room for trees, drainage, and cycling routes.',
      'The station and mixed uses are focused on the main spine to intercept daily trips.',
    ],
    tradeoffs: [
      ['Pro: walkable access to services', 'Con: higher density in central areas'],
      ['Pro: maximum green and thermal comfort', 'Con: less buildable area'],
      ['Pro: less car pressure', 'Con: needs frequent public transport'],
    ],
    phases: ['Set the street grid and utilities', 'Deliver park, school, and core services', 'Complete homes and monitor traffic'],
    labels: { traffic: 'Peak traffic', cost: 'Estimated cost', green: 'Green space per resident', parking: 'Parking spaces', service: 'Services within 10 min', score: 'Score' },
    featureLabels: { homes: 'Homes', park: 'Park', school: 'School', station: 'Station', mixed: 'Mixed use' },
  },
}

const format = (value: number, language: Language) => new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-US', { maximumFractionDigits: 0 }).format(value)

function baseFeatures(labels: Copy['featureLabels'], variant: number): MapFeature[] {
  const park = variant === 1
    ? { x: 8, y: 28, width: 84, height: 20 }
    : { x: variant === 0 ? 35 : 62, y: 26, width: 27, height: 38 }
  return [
    { id: 'primary', kind: 'primary-road', x: 0, y: 70, width: 100, height: 7, label: '' },
    { id: 'local-a', kind: 'local-road', x: 30, y: 0, width: 5, height: 100, label: '' },
    { id: 'local-b', kind: 'local-road', x: 66, y: 0, width: 5, height: 100, label: '' },
    { id: 'homes-a', kind: 'housing', x: 7, y: 8, width: 20, height: 17, label: labels.homes },
    { id: 'homes-b', kind: 'housing', x: 74, y: 8, width: 19, height: 17, label: labels.homes },
    { id: 'homes-c', kind: 'housing', x: 8, y: 80, width: 18, height: 13, label: labels.homes },
    { id: 'mixed', kind: 'mixed', x: 74, y: 80, width: 18, height: 13, label: labels.mixed },
    { id: 'park', kind: 'park', label: labels.park, ...park },
    { id: 'school', kind: 'school', x: variant === 2 ? 39 : 38, y: 51, width: 20, height: 15, label: labels.school },
    { id: 'station', kind: 'station', x: variant === 2 ? 8 : 76, y: 55, width: 17, height: 10, label: labels.station },
  ]
}

export const SimulationConfig = {
  costMultiplier: 1.0,
  baseCostFixed: 18,
  costPerResident: 0.006,
  costPerHa: 0.08,
  currency: '€'
}

function simulateTraffic(features: MapFeature[], density: number): number {
  const homes = features.filter(f => f.kind === 'housing')
  const destinations = features.filter(f => f.kind === 'school' || f.kind === 'station' || f.kind === 'mixed')
  
  if (homes.length === 0 || destinations.length === 0) return 50
  
  let totalDistance = 0
  let paths = 0
  
  // Basic euclidean distance simulation for origin-destination graph
  homes.forEach(home => {
    const hx = home.x + home.width / 2
    const hy = home.y + home.height / 2
    destinations.forEach(dest => {
      const dx = dest.x + dest.width / 2
      const dy = dest.y + dest.height / 2
      // Manhattan distance to simulate grid streets
      const distance = Math.abs(hx - dx) + Math.abs(hy - dy)
      totalDistance += distance
      paths++
    })
  })
  
  const avgDistance = totalDistance / paths
  // Map avg distance (0-100) to a traffic score, penalized by density
  const traffic = Math.round((avgDistance * 0.4) + (density / 50))
  return Math.min(98, Math.max(10, traffic))
}

export function createScenarios(brief: UrbanBrief, language: Language): Scenario[] {
  const copy = text[language]
  const density = Math.max(1, brief.population / Math.max(brief.areaHa, 1))
  const baseCost = (SimulationConfig.baseCostFixed + brief.population * SimulationConfig.costPerResident + brief.areaHa * SimulationConfig.costPerHa) * SimulationConfig.costMultiplier
  
  const variants = [
    { green: 18, parking: 0.42, service: 92, cost: 1.0, score: 87 },
    { green: 28, parking: 0.31, service: 86, cost: 1.11, score: 91 },
    { green: 16, parking: 0.36, service: 95, cost: 1.18, score: 93 },
  ]
  return variants.map((v, index) => {
    const features = baseFeatures(copy.featureLabels, index)
    const traffic = simulateTraffic(features, density)
    const parking = Math.round(brief.population * v.parking)
    const green = Math.round(v.green)
    return {
      id: `scenario-${index + 1}`,
      title: copy.names[index],
      subtitle: copy.subtitles[index],
      narrative: copy.narratives[index],
      tradeoffs: copy.tradeoffs[index],
      phases: copy.phases,
      score: v.score,
      traffic,
      costM: Math.round(baseCost * v.cost),
      greenM2: green,
      parking,
      indicators: [
        { label: copy.labels.traffic, value: `${traffic}/100`, tone: traffic < 30 ? 'good' : 'warn' },
        { label: copy.labels.cost, value: `${SimulationConfig.currency} ${format(Math.round(baseCost * v.cost), language)} M`, tone: 'neutral' },
        { label: copy.labels.green, value: `${green} m²`, tone: green >= 20 ? 'good' : 'neutral' },
        { label: copy.labels.parking, value: format(parking, language), tone: 'neutral' },
        { label: copy.labels.service, value: `${v.service}%`, tone: 'good' },
        { label: copy.labels.score, value: `${v.score}/100`, tone: 'good' },
      ],
      features: baseFeatures(copy.featureLabels, index),
    }
  })
}

export function scenarioGeoJson(scenario: Scenario) {
  return {
    type: 'FeatureCollection',
    features: scenario.features.map((feature) => ({
      type: 'Feature',
      properties: { id: feature.id, kind: feature.kind, name: feature.label, scenario: scenario.title },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [feature.x, feature.y], [feature.x + feature.width, feature.y], [feature.x + feature.width, feature.y + feature.height], [feature.x, feature.y + feature.height], [feature.x, feature.y],
        ]],
      },
    })),
  }
}

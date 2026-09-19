export type Language = 'it' | 'en'

export type UrbanBrief = {
  city: string
  population: number
  areaHa: number
  priorities: string[]
}

export type ZoneKind = 'housing' | 'park' | 'school' | 'station' | 'mixed'

export type MapFeature = {
  id: string
  kind: ZoneKind | 'primary-road' | 'local-road'
  x: number
  y: number
  width: number
  height: number
  label: string
}

export type Indicator = {
  label: string
  value: string
  tone: 'good' | 'warn' | 'neutral'
}

export type Scenario = {
  id: string
  title: string
  subtitle: string
  narrative: string
  tradeoffs: string[]
  phases: string[]
  indicators: Indicator[]
  features: MapFeature[]
  score: number
  traffic: number
  costM: number
  greenM2: number
  parking: number
}

export type CityResult = {
  name: string
  lat: number
  lng: number
}

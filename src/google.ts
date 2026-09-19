import { Loader } from '@googlemaps/js-api-loader'
import type { CityResult } from './types'

export async function geocodeCity(city: string): Promise<CityResult | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  if (!apiKey || !city.trim()) return null
  const loader = new Loader({ apiKey, version: 'weekly' })
  await loader.importLibrary('geocoding')
  const geocoder = new google.maps.Geocoder()
  const result = await geocoder.geocode({ address: city })
  const first = result.results[0]
  if (!first) return null
  const position = first.geometry.location
  return { name: first.formatted_address, lat: position.lat(), lng: position.lng() }
}

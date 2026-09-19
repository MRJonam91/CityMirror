import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useRef, useState } from 'react'
import type { CityResult, Language } from './types'

type Props = {
  city: CityResult | null
  language: Language
}

const labels = {
  it: { unavailable: 'Aggiungi VITE_GOOGLE_MAPS_API_KEY per vedere la mappa di contesto.', loading: 'Caricamento mappa…', error: 'Google Maps non è disponibile. La simulazione locale resta attiva.' },
  en: { unavailable: 'Add VITE_GOOGLE_MAPS_API_KEY to view the contextual map.', loading: 'Loading map…', error: 'Google Maps is unavailable. The local simulation remains active.' },
}

export function GoogleMap({ city, language }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<google.maps.Map | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

  useEffect(() => {
    if (!apiKey || !container.current || map.current) return
    setStatus('loading')
    const loader = new Loader({ apiKey, version: 'weekly' })
    loader.importLibrary('maps')
      .then(() => {
        if (!container.current) return
        map.current = new google.maps.Map(container.current, {
          center: { lat: 41.9028, lng: 12.4964 },
          zoom: 11,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          mapId: 'DEMO_MAP_ID',
        })
        setStatus('idle')
      })
      .catch(() => setStatus('error'))
  }, [apiKey])

  useEffect(() => {
    if (city && map.current) map.current.panTo({ lat: city.lat, lng: city.lng })
  }, [city])

  if (!apiKey) return <div className="map-placeholder"><span>⌁</span><p>{labels[language].unavailable}</p></div>
  if (status === 'error') return <div className="map-placeholder"><span>!</span><p>{labels[language].error}</p></div>
  return <div className="map-wrap"><div className="google-map" ref={container} />{status === 'loading' && <div className="map-loading">{labels[language].loading}</div>}</div>
}

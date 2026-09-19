export type Bounds = {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

// Approximate Haversine formula to get distance between two lat/lng points in meters
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3
  const p1 = lat1 * Math.PI / 180
  const p2 = lat2 * Math.PI / 180
  const dp = (lat2 - lat1) * Math.PI / 180
  const dl = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseGeoJsonArea(geoJson: any): { areaHa: number, bounds: Bounds } | null {
  if (!geoJson || geoJson.type !== 'FeatureCollection' || !geoJson.features || geoJson.features.length === 0) {
    return null
  }

  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity

  // Extract all coordinates to find bounding box
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geoJson.features.forEach((feature: any) => {
    if (feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
      const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      polygons.forEach((polygon: any[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        polygon.forEach((ring: any[]) => {
          ring.forEach((coord: number[]) => {
            const lng = coord[0]
            const lat = coord[1]
            if (lat < minLat) minLat = lat
            if (lat > maxLat) maxLat = lat
            if (lng < minLng) minLng = lng
            if (lng > maxLng) maxLng = lng
          })
        })
      })
    }
  })

  if (minLat === Infinity) return null

  // Calculate approximate width and height in meters
  const widthMeters = getDistance(minLat, minLng, minLat, maxLng)
  const heightMeters = getDistance(minLat, minLng, maxLat, minLng)

  // Area in square meters -> hectares (1 ha = 10,000 m2)
  const areaSqM = widthMeters * heightMeters
  const areaHa = areaSqM / 10000

  return {
    areaHa: Math.round(areaHa * 100) / 100,
    bounds: { minLat, maxLat, minLng, maxLng }
  }
}

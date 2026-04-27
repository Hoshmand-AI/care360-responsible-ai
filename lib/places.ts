// ===========================================
// CARE360 AI - Google Places Integration
// A Hoshmand AI Product
// ===========================================

export interface PlaceResult {
  placeId: string
  name: string
  address: string
  type: 'pharmacy' | 'doctor' | 'urgent_care' | 'hospital'
  phone?: string
  website?: string
  rating?: number
  totalRatings?: number
  latitude: number
  longitude: number
  distance?: number
  isOpen?: boolean
  openUntil?: string
  photoUrl?: string
}

export interface SearchPlacesInput {
  latitude: number
  longitude: number
  type: 'pharmacy' | 'doctor' | 'urgent_care' | 'hospital' | 'all'
  radius?: number // in meters, default 5000 (5km)
  keyword?: string
}

// Map our types to Google Places types
const placeTypeMapping: Record<string, string> = {
  pharmacy: 'pharmacy',
  doctor: 'doctor',
  urgent_care: 'hospital', // Google doesn't have urgent_care, use hospital
  hospital: 'hospital',
}

// ===========================================
// SEARCH NEARBY PLACES
// ===========================================

export async function searchNearbyPlaces(
  input: SearchPlacesInput
): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  
  if (!apiKey) {
    throw new Error('Google Places API key not configured')
  }

  const { latitude, longitude, type, radius = 5000, keyword } = input
  
  let results: PlaceResult[] = []
  
  // Determine which types to search
  const typesToSearch = type === 'all' 
    ? ['pharmacy', 'doctor', 'hospital']
    : [placeTypeMapping[type] || type]
  
  for (const placeType of typesToSearch) {
    const params = new URLSearchParams({
      location: `${latitude},${longitude}`,
      radius: radius.toString(),
      type: placeType,
      key: apiKey,
    })
    
    if (keyword) {
      params.append('keyword', keyword)
    }
    
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status === 'OK' && data.results) {
      const places = data.results.map((place: any) => ({
        placeId: place.place_id,
        name: place.name,
        address: place.vicinity || place.formatted_address,
        type: mapGoogleTypeToOurs(place.types),
        rating: place.rating,
        totalRatings: place.user_ratings_total,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        isOpen: place.opening_hours?.open_now,
        photoUrl: place.photos?.[0]?.photo_reference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`
          : undefined,
        distance: calculateDistance(
          latitude,
          longitude,
          place.geometry.location.lat,
          place.geometry.location.lng
        ),
      }))
      
      results = [...results, ...places]
    }
  }
  
  // Sort by distance
  results.sort((a, b) => (a.distance || 0) - (b.distance || 0))
  
  return results
}

// ===========================================
// GET PLACE DETAILS
// ===========================================

export async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  
  if (!apiKey) {
    throw new Error('Google Places API key not configured')
  }
  
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,geometry,opening_hours,types,photos',
    key: apiKey,
  })
  
  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`
  
  const response = await fetch(url)
  const data = await response.json()
  
  if (data.status !== 'OK' || !data.result) {
    return null
  }
  
  const place = data.result
  
  return {
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address,
    type: mapGoogleTypeToOurs(place.types),
    phone: place.formatted_phone_number,
    website: place.website,
    rating: place.rating,
    totalRatings: place.user_ratings_total,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    isOpen: place.opening_hours?.open_now,
    openUntil: getCurrentOpenUntil(place.opening_hours),
    photoUrl: place.photos?.[0]?.photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`
      : undefined,
  }
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function mapGoogleTypeToOurs(
  types: string[]
): 'pharmacy' | 'doctor' | 'urgent_care' | 'hospital' {
  if (types.includes('pharmacy')) return 'pharmacy'
  if (types.includes('doctor')) return 'doctor'
  if (types.includes('hospital')) return 'hospital'
  return 'doctor' // default
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula for distance in miles
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

function getCurrentOpenUntil(openingHours: any): string | undefined {
  if (!openingHours?.weekday_text) return undefined
  
  const now = new Date()
  const dayIndex = now.getDay()
  // Google uses Monday = 0, JavaScript uses Sunday = 0
  const googleDayIndex = dayIndex === 0 ? 6 : dayIndex - 1
  
  const todayHours = openingHours.weekday_text[googleDayIndex]
  if (!todayHours) return undefined
  
  // Extract closing time (e.g., "Monday: 9:00 AM – 9:00 PM" -> "9:00 PM")
  const match = todayHours.match(/–\s*(.+)$/)
  return match ? match[1] : undefined
}

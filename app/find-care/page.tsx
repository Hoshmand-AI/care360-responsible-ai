'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Search, 
  MapPin, 
  Phone, 
  Navigation, 
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  Filter
} from 'lucide-react'

interface Place {
  placeId: string
  name: string
  address: string
  distance?: string
  rating?: number
  totalRatings?: number
  phone?: string
  website?: string
  isOpen?: boolean
  openUntil?: string
  type: 'pharmacy' | 'doctor' | 'urgent_care' | 'hospital'
  latitude: number
  longitude: number
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pharmacy', label: 'Pharmacies' },
  { value: 'doctor', label: 'Doctors' },
  { value: 'urgent_care', label: 'Urgent Care' },
  { value: 'hospital', label: 'Hospitals' },
]

// Mock data for demonstration
const MOCK_PLACES: Place[] = [
  {
    placeId: '1',
    name: 'CVS Pharmacy',
    address: '1234 Main Street, McLean, VA 22101',
    distance: '0.3 mi',
    rating: 4.2,
    totalRatings: 128,
    phone: '(703) 555-0123',
    isOpen: true,
    openUntil: '10pm',
    type: 'pharmacy',
    latitude: 38.9339,
    longitude: -77.1773,
  },
  {
    placeId: '2',
    name: 'Walgreens',
    address: '5678 Oak Avenue, McLean, VA 22102',
    distance: '0.5 mi',
    rating: 4.0,
    totalRatings: 95,
    phone: '(703) 555-0456',
    isOpen: true,
    openUntil: '24 hours',
    type: 'pharmacy',
    latitude: 38.9356,
    longitude: -77.1801,
  },
  {
    placeId: '3',
    name: 'Inova Urgent Care',
    address: '789 Tysons Blvd, Tysons, VA 22182',
    distance: '0.8 mi',
    rating: 4.5,
    totalRatings: 312,
    phone: '(703) 555-0789',
    isOpen: true,
    openUntil: '8pm',
    type: 'urgent_care',
    latitude: 38.9189,
    longitude: -77.2231,
  },
  {
    placeId: '4',
    name: 'Dr. Sarah Johnson, MD',
    address: '456 Medical Center Dr, Vienna, VA 22180',
    distance: '1.5 mi',
    rating: 4.8,
    totalRatings: 89,
    phone: '(703) 555-1234',
    isOpen: true,
    type: 'doctor',
    latitude: 38.9012,
    longitude: -77.2654,
  },
  {
    placeId: '5',
    name: 'Rite Aid',
    address: '910 Elm Street, Falls Church, VA 22046',
    distance: '1.2 mi',
    rating: 3.8,
    totalRatings: 67,
    phone: '(703) 555-5678',
    isOpen: false,
    openUntil: 'Opens 8am',
    type: 'pharmacy',
    latitude: 38.8823,
    longitude: -77.1712,
  },
  {
    placeId: '6',
    name: 'Inova Fairfax Medical Campus',
    address: '3300 Gallows Rd, Falls Church, VA 22042',
    distance: '2.1 mi',
    rating: 4.3,
    totalRatings: 847,
    phone: '(703) 776-4001',
    isOpen: true,
    openUntil: '24 hours',
    type: 'hospital',
    latitude: 38.8562,
    longitude: -77.1994,
  },
  {
    placeId: '7',
    name: 'Virginia Hospital Center',
    address: '1701 N George Mason Dr, Arlington, VA 22205',
    distance: '3.4 mi',
    rating: 4.1,
    totalRatings: 623,
    phone: '(703) 558-5000',
    isOpen: true,
    openUntil: '24 hours',
    type: 'hospital',
    latitude: 38.8830,
    longitude: -77.1244,
  },
  {
    placeId: '8',
    name: 'Reston Hospital Center',
    address: '1850 Town Center Pkwy, Reston, VA 20190',
    distance: '4.2 mi',
    rating: 3.9,
    totalRatings: 412,
    phone: '(703) 689-9000',
    isOpen: true,
    openUntil: '24 hours',
    type: 'hospital',
    latitude: 38.9586,
    longitude: -77.3570,
  },
]

export default function FindCarePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FindCareContent />
    </Suspense>
  )
}

function FindCareContent() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState(typeParam || 'all')
  const [openNowOnly, setOpenNowOnly] = useState(false)
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES)
  const [savedPlaces, setSavedPlaces] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }
  }, [])

  // Filter places based on search and filter
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === 'all' || place.type === activeFilter
    const matchesOpenNow = !openNowOnly || place.isOpen === true
    return matchesSearch && matchesFilter && matchesOpenNow
  })

  const toggleSave = (placeId: string) => {
    setSavedPlaces(prev => 
      prev.includes(placeId) 
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    )
  }

  const openDirections = (place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`
    window.open(url, '_blank')
  }

  const callPlace = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^0-9]/g, '')}`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search pharmacies, doctors, urgent care..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-lg
                  text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500
                  focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <button className="px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 
              hover:bg-slate-100 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {FILTER_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${activeFilter === option.value 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
            <button
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                flex items-center gap-1.5
                ${openNowOnly
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }
              `}
            >
              <Clock className="w-3.5 h-3.5" />
              Open Now
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Results List */}
          <div className="lg:col-span-3">
            <p className="text-sm text-slate-500 mb-4">
              {filteredPlaces.length} location{filteredPlaces.length !== 1 ? 's' : ''} near you
            </p>

            <div className="space-y-4">
              {filteredPlaces.map(place => (
                <PlaceCard
                  key={place.placeId}
                  place={place}
                  isSaved={savedPlaces.includes(place.placeId)}
                  onSave={() => toggleSave(place.placeId)}
                  onDirections={() => openDirections(place)}
                  onCall={() => place.phone && callPlace(place.phone)}
                />
              ))}

              {filteredPlaces.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                  <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No locations found</p>
                  <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="sticky top-40">
              <div className="bg-slate-200 rounded-lg h-[400px] lg:h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="font-medium">Interactive Map</p>
                  <p className="text-sm text-slate-400 mt-1">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaceCard({ 
  place, 
  isSaved, 
  onSave, 
  onDirections, 
  onCall 
}: { 
  place: Place
  isSaved: boolean
  onSave: () => void
  onDirections: () => void
  onCall: () => void
}) {
  const typeLabels: Record<string, string> = {
    pharmacy: 'Pharmacy',
    doctor: 'Doctor',
    urgent_care: 'Urgent Care',
    hospital: 'Hospital',
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 
      hover:shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-slate-800">{place.name}</h3>
            <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
              {typeLabels[place.type]}
            </span>
          </div>
          {place.rating && (
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{place.rating}</span>
              {place.totalRatings && (
                <span className="text-slate-400">({place.totalRatings})</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-teal-600">{place.distance}</span>
          <button
            onClick={onSave}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-teal-600" />
            ) : (
              <Bookmark className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-3">
        <span className={`
          inline-block text-xs font-medium px-2.5 py-1 rounded-md
          ${place.isOpen 
            ? 'bg-green-100 text-green-700' 
            : 'bg-slate-100 text-slate-500'
          }
        `}>
          {place.isOpen 
            ? `Open${place.openUntil ? ` until ${place.openUntil}` : ''}` 
            : place.openUntil || 'Closed'
          }
        </span>
      </div>

      {/* Address */}
      <p className="text-sm text-slate-500 mb-4">{place.address}</p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onDirections}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
            bg-white border border-slate-300 rounded-lg text-sm font-semibold 
            text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </button>
        {place.phone && (
          <button
            onClick={onCall}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
              bg-teal-600 rounded-lg text-sm font-semibold text-white 
              hover:bg-teal-500 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call
          </button>
        )}
      </div>
    </div>
  )
}

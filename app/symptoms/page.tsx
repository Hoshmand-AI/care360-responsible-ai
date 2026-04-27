'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, User } from 'lucide-react'
import { EmergencyBanner } from '@/components/responsible/EmergencyBanner'
import { detectEmergency } from '@/lib/ai/openai'

const COMMON_SYMPTOMS = ['Headache', 'Fever', 'Cough', 'Sore throat', 'Fatigue', 'Nausea', 'Dizziness', 'Body aches', 'Congestion', 'Chills', 'Runny nose', 'Sneezing']
const DIGESTIVE_SYMPTOMS = ['Stomach pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Bloating']
const EMERGENCY_SYMPTOMS = ['Chest pain', 'Difficulty breathing', 'Severe bleeding', 'Loss of consciousness']
const ALL_SYMPTOMS = [...COMMON_SYMPTOMS, ...DIGESTIVE_SYMPTOMS, ...EMERGENCY_SYMPTOMS]
const DURATION_OPTIONS = ['Less than a day', '1-3 days', '4-7 days', 'Over a week']
const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'Mild', description: 'Noticeable but not interfering with daily activities' },
  { value: 'moderate', label: 'Moderate', description: 'Affecting some daily activities' },
  { value: 'severe', label: 'Severe', description: 'Significantly impacting daily life' },
]

export default function SymptomsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showEmergency, setShowEmergency] = useState(false)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [duration, setDuration] = useState('')
  const [severity, setSeverity] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  // v2: Bio-Safety Profile
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('')
  const [weight, setWeight] = useState('')
  const [allergies, setAllergies] = useState('')
  const [currentMedications, setCurrentMedications] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleSymptom = (symptom: string) => {
    // Emergency check on every symptom toggle
    if (detectEmergency(symptom)) { setShowEmergency(true); return }
    setSelectedSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom])
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (detectEmergency(searchQuery)) { setShowEmergency(true); setSearchQuery(''); return }
      const trimmed = searchQuery.trim()
      if (!selectedSymptoms.includes(trimmed)) setSelectedSymptoms(prev => [...prev, trimmed])
      setSearchQuery('')
    }
  }

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) return
    // Final emergency check before submission
    const allText = selectedSymptoms.join(' ') + ' ' + additionalInfo
    if (detectEmergency(allText)) { setShowEmergency(true); return }

    setIsLoading(true); setError(null)
    try {
      const response = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms, duration, severity, additionalInfo,
          age: age ? parseInt(age) : undefined, sex: sex || undefined,
          weight: weight || undefined,
          allergies: allergies ? allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
          currentMedications: currentMedications ? currentMedications.split(',').map(s => s.trim()).filter(Boolean) : [],
        }),
      })
      if (!response.ok) throw new Error('Failed to analyze symptoms')
      const data = await response.json()
      if (data.data?.urgencyLevel === 'emergency') { setShowEmergency(true); return }
      sessionStorage.setItem('symptomResults', JSON.stringify({
        input: { symptoms: selectedSymptoms, duration, severity },
        results: data.data,
      }))
      router.push('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const isSearching = searchQuery.trim().length > 0
  const filteredCommon = isSearching ? COMMON_SYMPTOMS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())) : COMMON_SYMPTOMS
  const filteredDigestive = isSearching ? DIGESTIVE_SYMPTOMS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())) : DIGESTIVE_SYMPTOMS
  const filteredEmergency = isSearching ? EMERGENCY_SYMPTOMS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())) : EMERGENCY_SYMPTOMS
  const queryMatchesPredefined = ALL_SYMPTOMS.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  const showCustomHint = isSearching && !queryMatchesPredefined && searchQuery.trim().length > 1
  const noResults = isSearching && filteredCommon.length === 0 && filteredDigestive.length === 0 && filteredEmergency.length === 0

  if (showEmergency) return <EmergencyBanner />

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-display text-navy-950 mb-2">Symptom Checker</h1>
        <p className="text-slate-500 mb-6">Tell us what you&apos;re experiencing and we&apos;ll provide responsible guidance.</p>

        {/* v2: AI Disclosure - no emoji */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 text-sm mb-6">
          <p className="text-teal-700"><strong>AI Disclosure:</strong> Analysis powered by <strong>GPT-4o (OpenAI)</strong>. Results include a confidence score and source citations. Not a medical diagnosis.</p>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-md transition-colors ${i <= step ? 'bg-teal-500' : 'bg-slate-200'}`} />
          ))}
        </div>
        <div className="text-xs text-slate-400 mb-6 -mt-4">
          Step {step} of 4: {step === 1 ? 'Select Symptoms' : step === 2 ? 'Health Profile (Safety)' : step === 3 ? 'Details' : 'Review & Submit'}
        </div>

        {/* Step 1: Symptoms */}
        {step === 1 && (
          <>
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Search or type a symptom and press Enter..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyDown}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
              </div>
              {showCustomHint && <p className="mt-2 text-sm text-teal-600">Press Enter to add &quot;{searchQuery.trim()}&quot; as a custom symptom</p>}
              {selectedSymptoms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedSymptoms.map(symptom => (
                    <span key={symptom} className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                      {symptom}
                      <button onClick={() => setSelectedSymptoms(prev => prev.filter(s => s !== symptom))} className="hover:bg-teal-700 rounded-md p-0.5"><X className="w-4 h-4" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {filteredCommon.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Common Symptoms</h3>
                <div className="flex flex-wrap gap-2.5">
                  {filteredCommon.map(s => <SymptomChip key={s} label={s} selected={selectedSymptoms.includes(s)} onClick={() => toggleSymptom(s)} />)}
                </div>
              </div>
            )}

            {filteredDigestive.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Digestive</h3>
                <div className="flex flex-wrap gap-2.5">
                  {filteredDigestive.map(s => <SymptomChip key={s} label={s} selected={selectedSymptoms.includes(s)} onClick={() => toggleSymptom(s)} />)}
                </div>
              </div>
            )}

            {filteredEmergency.length > 0 && (
              <div className="bg-white border border-red-200 rounded-lg p-5 mb-8">
                <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">⚠️ Seek Immediate Care</h3>
                <p className="text-xs text-red-400 mb-3">Selecting these symptoms will activate the emergency protocol</p>
                <div className="flex flex-wrap gap-2.5">
                  {filteredEmergency.map(s => <SymptomChip key={s} label={s} selected={selectedSymptoms.includes(s)} onClick={() => toggleSymptom(s)} emergency />)}
                </div>
              </div>
            )}

            {noResults && (
              <div className="bg-white border border-slate-200 rounded-lg p-8 mb-8 text-center">
                <p className="text-slate-500 mb-2">No predefined symptoms match &quot;{searchQuery}&quot;</p>
                <p className="text-sm text-teal-600">Press Enter to add it as a custom symptom</p>
              </div>
            )}
          </>
        )}

        {/* Step 2: Bio-Safety Profile — Roxette's mandatory health profile for OTC */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-teal-800 text-sm">Bio-Safety Profile Required</p>
                  <p className="text-xs text-teal-600 mt-0.5">This information is used to check drug contraindications and personalize your results. All fields are optional but improve safety.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Basic Information <span className="text-slate-400 font-normal text-sm">(optional)</span></h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Age</label>
                  <input type="number" placeholder="e.g. 32" value={age} onChange={e => setAge(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Biological Sex</label>
                  <select value={sex} onChange={e => setSex(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500 text-sm bg-white">
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Weight (lbs)</label>
                  <input type="text" placeholder="e.g. 150 lbs" value={weight} onChange={e => setWeight(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Race/Ethnicity</label>
                  <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500 text-sm bg-white">
                    <option value="">Prefer not to say</option>
                    <option>White</option><option>Black or African American</option>
                    <option>Hispanic or Latino</option><option>Asian</option>
                    <option>Native American</option><option>Pacific Islander</option><option>Multiracial</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h3 className="font-semibold text-slate-800 mb-1">Known Allergies <span className="text-slate-400 font-normal text-sm">(optional)</span></h3>
              <p className="text-xs text-slate-400 mb-3">Separate multiple allergies with commas</p>
              <input type="text" placeholder="e.g. penicillin, sulfa, aspirin" value={allergies} onChange={e => setAllergies(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
            </div>

            <div className="bg-white border border-orange-200 rounded-lg p-5">
              <h3 className="font-semibold text-slate-800 mb-1">Current Medications <span className="text-orange-500 font-normal text-sm">⚠️ Important for drug interaction check</span></h3>
              <p className="text-xs text-slate-400 mb-3">Separate multiple medications with commas. This prevents dangerous drug interactions.</p>
              <input type="text" placeholder="e.g. warfarin, metformin, lisinopril" value={currentMedications} onChange={e => setCurrentMedications(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-500 text-sm" />
              <p className="text-xs text-orange-600 mt-2">If you take blood thinners, certain OTC medications will be flagged as potentially dangerous.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-500 text-center">
                🔒 This information is used only to generate safer, more personalized results. 
                Results may not apply to all users due to individual health variation. <a href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Duration & Severity */}
        {step === 3 && (
          <>
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4">How long have you had these symptoms?</h3>
              <div className="grid grid-cols-2 gap-3">
                {DURATION_OPTIONS.map(option => (
                  <button key={option} onClick={() => setDuration(option)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all ${duration === option ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <h3 className="text-base font-semibold text-slate-800 mb-4">How severe are your symptoms?</h3>
              <div className="space-y-3">
                {SEVERITY_OPTIONS.map(option => (
                  <button key={option.value} onClick={() => setSeverity(option.value)}
                    className={`w-full px-4 py-4 rounded-lg text-left border transition-all ${severity === option.value ? 'bg-teal-50 border-teal-500' : 'bg-white border-slate-200 hover:border-teal-300'}`}>
                    <p className={`font-semibold ${severity === option.value ? 'text-teal-700' : 'text-slate-800'}`}>{option.label}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-8">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Anything else? <span className="font-normal text-slate-400">(optional)</span></h3>
              <textarea value={additionalInfo} onChange={e => setAdditionalInfo(e.target.value)}
                placeholder="Recent travel, other symptoms, etc..." rows={3}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 resize-none" />
            </div>
          </>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <>
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <h3 className="font-semibold text-slate-800 mb-4">Review Your Submission</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map(s => <span key={s} className="bg-teal-100 text-teal-700 px-3 py-1.5 rounded-md text-sm font-medium">{s}</span>)}
                  </div>
                </div>
                {duration && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Duration</p><p className="text-slate-700 text-sm">{duration}</p></div>}
                {severity && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Severity</p>
                  <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium capitalize ${severity === 'mild' ? 'bg-green-100 text-green-700' : severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{severity}</span>
                </div>}
                {(age || sex) && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Health Profile</p>
                  <p className="text-slate-700 text-sm">{[age && `Age: ${age}`, sex && `Sex: ${sex}`, weight && `Weight: ${weight}`].filter(Boolean).join(' · ')}</p>
                </div>}
                {allergies && <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Allergies</p><p className="text-slate-700 text-sm">{allergies}</p></div>}
                {currentMedications && <div><p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">⚠️ Current Medications (Drug check active)</p><p className="text-slate-700 text-sm">{currentMedications}</p></div>}
              </div>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-teal-700 text-center">Analysis by <strong>GPT-4o</strong> · Results include confidence score & source citations · Model version logged for accountability</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800 text-center"><strong>Human oversight required</strong> — Always consult a licensed healthcare provider. Results may not apply to all users.</p>
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"><p className="text-red-700 text-sm">{error}</p></div>}
          </>
        )}

        {/* Navigation */}
        <div className="flex gap-4">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 px-6 py-3.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors">Back</button>
          )}
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} disabled={step === 1 && selectedSymptoms.length === 0}
              className="flex-1 px-6 py-3.5 bg-teal-600 rounded-lg text-white font-semibold hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading}
              className="flex-1 px-6 py-3.5 bg-teal-600 rounded-lg text-white font-semibold hover:bg-teal-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</> : <>Get Responsible Guidance <ArrowRight className="w-4 h-4" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function SymptomChip({ label, selected, onClick, emergency = false }: { label: string; selected: boolean; onClick: () => void; emergency?: boolean }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2.5 rounded-md text-sm font-medium border transition-all ${selected ? 'bg-teal-600 border-teal-600 text-white' : emergency ? 'bg-white border-red-300 text-red-600 hover:bg-red-50' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50'}`}>
      {label}
    </button>
  )
}

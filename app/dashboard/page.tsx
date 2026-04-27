'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Stethoscope, 
  Pill, 
  UserRound, 
  MessageCircle,
  Lightbulb,
  CheckCircle,
  MapPin
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    )
  }

  if (!session) {
    redirect('/login')
  }

  const userName = session.user?.name || session.user?.email?.split('@')[0] || 'there'
  const greeting = getGreeting()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <p className="text-sm text-slate-500 mb-1">{greeting}</p>
          <h1 className="text-2xl sm:text-3xl font-display text-navy-950">
            Hi, {userName} 👋
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tip Banner */}
        <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 sm:p-5 mb-6 sm:mb-8">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">
                Tip of the day
              </p>
              <p className="text-sm text-slate-700">
                Staying hydrated helps your body fight off illness. Aim for 8 glasses of water daily, more if you&apos;re active or it&apos;s hot outside.
              </p>
            </div>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-lg font-semibold text-navy-950 mb-4">
          How are you feeling today?
        </h2>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <Link href="/symptoms">
            <QuickActionCard
              icon={<Stethoscope className="w-8 h-8" />}
              label="Check Symptoms"
              color="teal"
            />
          </Link>
          <Link href="/find-care?type=pharmacy">
            <QuickActionCard
              icon={<Pill className="w-8 h-8" />}
              label="Find Pharmacy"
              color="green"
            />
          </Link>
          <Link href="/find-care?type=doctor">
            <QuickActionCard
              icon={<UserRound className="w-8 h-8" />}
              label="Find Doctor"
              color="blue"
            />
          </Link>
          <Link href="/chat">
            <QuickActionCard
              icon={<MessageCircle className="w-8 h-8" />}
              label="AI Advisor"
              color="purple"
            />
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-navy-950">Recent Activity</h3>
              <Link href="/history" className="text-sm font-medium text-teal-600 hover:text-teal-700">
                View all
              </Link>
            </div>

            <div className="space-y-1">
              <ActivityItem
                title="Headache & Fatigue"
                subtitle="2 days ago · Self-care recommended"
                icon={<CheckCircle className="w-5 h-5 text-green-500" />}
              />
              <ActivityItem
                title="Sore Throat"
                subtitle="1 week ago · OTC suggested"
                icon={<CheckCircle className="w-5 h-5 text-green-500" />}
              />
              <ActivityItem
                title="CVS Pharmacy Visit"
                subtitle="1 week ago · McLean, VA"
                icon={<MapPin className="w-5 h-5 text-teal-500" />}
              />
            </div>

            {/* Empty state */}
            {false && (
              <div className="text-center py-8">
                <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No recent activity yet</p>
                <Link href="/symptoms" className="text-teal-600 font-medium text-sm mt-1 inline-block hover:underline">
                  Check your symptoms →
                </Link>
              </div>
            )}
          </div>

          {/* Saved Locations */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-navy-950">Saved Locations</h3>
              <Link href="/find-care" className="text-sm font-medium text-teal-600 hover:text-teal-700">
                Find more
              </Link>
            </div>

            <div className="space-y-1">
              <SavedLocationItem
                name="CVS Pharmacy"
                distance="0.3 mi"
                status="Open until 10pm"
                type="pharmacy"
              />
              <SavedLocationItem
                name="Dr. Smith Family Care"
                distance="1.2 mi"
                status="Primary Care"
                type="doctor"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function QuickActionCard({ 
  icon, 
  label, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  color: 'teal' | 'green' | 'blue' | 'purple'
}) {
  const colorClasses = {
    teal: 'bg-teal-50 border-teal-100 hover:border-teal-200',
    green: 'bg-green-50 border-green-100 hover:border-green-200',
    blue: 'bg-blue-50 border-blue-100 hover:border-blue-200',
    purple: 'bg-purple-50 border-purple-100 hover:border-purple-200',
  }

  const iconColors = {
    teal: 'text-teal-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
  }

  return (
    <div className={`
      ${colorClasses[color]}
      border rounded-lg p-5 sm:p-6 text-center cursor-pointer
      transition-colors duration-200 hover:shadow-card-hover
    `}>
      <div className={`${iconColors[color]} mx-auto mb-3`}>
        {icon}
      </div>
      <p className="text-sm sm:text-base font-semibold text-slate-800">{label}</p>
    </div>
  )
}

function ActivityItem({ 
  title, 
  subtitle, 
  icon 
}: { 
  title: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <h4 className="text-[15px] font-semibold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      {icon}
    </div>
  )
}

function SavedLocationItem({ 
  name, 
  distance, 
  status,
  type
}: { 
  name: string
  distance: string
  status: string
  type: 'pharmacy' | 'doctor'
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <h4 className="text-[15px] font-semibold text-slate-800">{name}</h4>
        <p className="text-sm text-slate-500">{distance} · {status}</p>
      </div>
      {type === 'pharmacy' ? (
        <Pill className="w-5 h-5 text-green-500" />
      ) : (
        <UserRound className="w-5 h-5 text-blue-500" />
      )}
    </div>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

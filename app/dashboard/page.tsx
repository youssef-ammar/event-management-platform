'use client'

import { useEffect, useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { StatCard } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'
import { Users, CheckCircle, Clock, XCircle, BarChart3 } from 'lucide-react'
import { useEvent } from '@/lib/hooks/useEvent'
import { getDashboard } from '@/lib/api/events'
import { formatDateShort, formatRelative } from '@/lib/utils/formatDate'
import type { ActivityItem } from '@/lib/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const actionLabel = {
  accepted: { label: 'a accepté', color: 'green' as const },
  declined: { label: 'a refusé', color: 'red' as const },
  pending: { label: 'n\'a pas encore répondu', color: 'amber' as const },
  viewed: { label: 'a consulté l\'invitation', color: 'blue' as const },
}

export default function DashboardPage() {
  const { event, eventId, loading: eventLoading } = useEvent()
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    if (!eventId) return
    setActivityLoading(true)
    getDashboard(eventId).then(({ activity }) => setActivity(activity)).finally(() => setActivityLoading(false))
  }, [eventId])

  if (eventLoading || !event) {
    return (
      <>
        <DashboardTopbar title="Tableau de bord" subtitle="Chargement…" />
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </>
    )
  }

  const { acceptedCount, pendingCount, declinedCount, totalGuests, steps } = event

  const rsvpData = [
    { name: 'Acceptés', value: acceptedCount, color: '#10B981' },
    { name: 'En attente', value: pendingCount, color: '#F59E0B' },
    { name: 'Refusés', value: declinedCount, color: '#EF4444' },
  ]

  return (
    <>
      <DashboardTopbar title="Tableau de bord" subtitle={`${event.coupleNames ?? event.name} · ${formatDateShort(event.date)}`} />
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total invités"
            value={totalGuests}
            colorClass="border-l-4 border-l-gray-300"
            icon={<Users className="w-6 h-6 text-gray-500" />}
          />
          <StatCard
            label="Acceptés"
            value={acceptedCount}
            colorClass="border-l-4 border-l-emerald-400"
            icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}
          />
          <StatCard
            label="En attente"
            value={pendingCount}
            colorClass="border-l-4 border-l-amber-400"
            icon={<Clock className="w-6 h-6 text-amber-500" />}
          />
          <StatCard
            label="Refusés"
            value={declinedCount}
            colorClass="border-l-4 border-l-red-400"
            icon={<XCircle className="w-6 h-6 text-red-500" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RSVP Donut Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-rose-500" />
              <h2 className="font-semibold text-gray-900">Répartition RSVP</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={rsvpData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {rsvpData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} invités`, name]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend
                    formatter={(value, entry) => (
                      <span className="text-sm text-gray-600">{value} ({(entry.payload as any).value})</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Progress bar */}
            {totalGuests > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full overflow-hidden bg-gray-100 flex-1">
                    <div className="h-full flex">
                      <div className="bg-emerald-400" style={{ width: `${(acceptedCount / totalGuests) * 100}%` }} />
                      <div className="bg-amber-400" style={{ width: `${(pendingCount / totalGuests) * 100}%` }} />
                      <div className="bg-red-400" style={{ width: `${(declinedCount / totalGuests) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{Math.round((acceptedCount / totalGuests) * 100)}%</span>
                </div>
                <p className="text-xs text-gray-400">{acceptedCount} confirmés sur {totalGuests} invités au total</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Activité récente</h2>
            {activityLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
              </div>
            ) : activity.length === 0 ? (
              <p className="text-sm text-gray-400">Aucune activité pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {activity.map((item) => {
                  const { label, color } = actionLabel[item.action]
                  return (
                    <div key={item.id} className="flex gap-3 items-start">
                      <Avatar name={item.guestName} size="sm" color={item.avatarColor} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{item.guestName}</span>{' '}
                          <span className="text-gray-500">{label}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge color={color} size="sm" dot>{item.action === 'accepted' ? 'Accepté' : item.action === 'declined' ? 'Refusé' : item.action === 'viewed' ? 'Vu' : 'En attente'}</Badge>
                          <span className="text-xs text-gray-400">{formatRelative(item.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Event Steps Overview */}
        {steps.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Étapes de l'événement</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step) => (
                <div key={step.id} className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-center">
                  <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide mb-2">{step.label}</p>
                  <p className="text-3xl font-bold text-gray-900 font-playfair">{step.guestCount}</p>
                  <p className="text-xs text-gray-400 mt-1">invités</p>
                  <p className="text-xs text-gray-500 mt-2">{step.date}</p>
                  <p className="text-xs text-gray-400">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

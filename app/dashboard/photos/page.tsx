'use client'

import { useEffect, useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SkeletonPhotoGrid } from '@/components/ui/Skeleton'
import { useEvent } from '@/lib/hooks/useEvent'
import { listPhotos, updatePhotoApproval } from '@/lib/api/photos'
import { ApiError } from '@/lib/api/client'
import type { Photo } from '@/lib/types'
import { ChevronLeft, ChevronRight, Download, X, Check, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils/formatDate'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

export default function PhotosPage() {
  const { eventId } = useEvent()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [view, setView] = useState<'grid' | 'guests'>('grid')

  useEffect(() => {
    if (!eventId) return
    setLoading(true)
    listPhotos(eventId).then(setPhotos).finally(() => setLoading(false))
  }, [eventId])

  const approved = photos.filter(p => p.approved)
  const pending = photos.filter(p => !p.approved)

  const openLightbox = (idx: number) => setLightboxIdx(idx)
  const closeLightbox = () => setLightboxIdx(null)
  const prevPhoto = () => setLightboxIdx(i => i !== null && i > 0 ? i - 1 : i)
  const nextPhoto = () => setLightboxIdx(i => i !== null && i < photos.length - 1 ? i + 1 : i)

  const approvePhoto = async (id: string) => {
    try {
      const updated = await updatePhotoApproval(eventId!, id, { approved: true })
      setPhotos(ps => ps.map(p => p.id === id ? updated : p))
      toast.success('Photo approuvée')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue')
    }
  }

  const guestSummary = photos.reduce((acc, p) => {
    if (!acc[p.guestId]) acc[p.guestId] = { name: p.guestName, count: 0, approved: 0 }
    acc[p.guestId].count++
    if (p.approved) acc[p.guestId].approved++
    return acc
  }, {} as Record<string, { name: string; count: number; approved: number }>)

  return (
    <>
      <DashboardTopbar title="Album photo" subtitle="Gérez les photos partagées par vos invités" />
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Photos totales', value: photos.length, icon: '📸', color: 'bg-blue-50 border-blue-100' },
            { label: 'Approuvées', value: approved.length, icon: '✅', color: 'bg-emerald-50 border-emerald-100' },
            { label: 'En attente', value: pending.length, icon: '⏳', color: 'bg-amber-50 border-amber-100' },
          ].map(s => (
            <div key={s.label} className={cn('rounded-xl border p-4 text-center', s.color)}>
              <span className="text-2xl">{s.icon}</span>
              <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" variant={view === 'grid' ? 'primary' : 'ghost'} onClick={() => setView('grid')}>Galerie</Button>
            <Button size="sm" variant={view === 'guests' ? 'primary' : 'ghost'} onClick={() => setView('guests')}>Par invité</Button>
          </div>
          {pending.length > 0 && (
            <Badge color="amber" size="md" dot>{pending.length} photo{pending.length > 1 ? 's' : ''} à approuver</Badge>
          )}
        </div>

        {loading ? (
          <SkeletonPhotoGrid />
        ) : view === 'grid' ? (
          <>
            {pending.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-sm text-amber-700">Photos en attente d'approbation</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {pending.map(photo => (
                    <div key={photo.id} className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden border-2 border-amber-300">
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-4xl">📸</div>
                      <div className="absolute inset-x-0 bottom-0 p-1 flex gap-1">
                        <button onClick={() => approvePhoto(photo.id)} className="flex-1 bg-emerald-500 text-white rounded-lg py-1 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                          <Check className="w-3 h-3" />
                        </button>
                        <button onClick={() => toast.success('Photo refusée')} className="flex-1 bg-red-500 text-white rounded-lg py-1 flex items-center justify-center hover:bg-red-600 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="absolute top-1 left-1 text-xs bg-amber-500 text-white rounded px-1">{photo.guestName.split(' ')[0]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Masonry grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
              {approved.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid mb-3 group relative rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(photos.indexOf(photo))}
                >
                  <div
                    className="w-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center"
                    style={{ height: `${140 + (idx % 4) * 40}px` }}
                  >
                    <span className="text-4xl">🖼️</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-xs font-semibold">{photo.guestName}</p>
                      <p className="text-white/70 text-xs">{formatDate(photo.uploadedAt, { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(guestSummary).map(([guestId, info]) => (
              <div key={guestId} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center font-bold text-rose-600">
                    {info.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{info.name}</p>
                    <p className="text-xs text-gray-400">{info.count} photos soumises</p>
                  </div>
                  <Badge color={info.count >= 12 ? 'green' : info.count >= 6 ? 'amber' : 'red'} size="sm" className="ml-auto">
                    {info.count}/12
                  </Badge>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full transition-all duration-1000" style={{ width: `${(info.count / 12) * 100}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{info.approved} approuvée{info.approved !== 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={e => { e.stopPropagation(); prevPhoto() }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative max-w-3xl max-h-[80vh] w-full mx-16" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden flex items-center justify-center" style={{ minHeight: '400px' }}>
              <span className="text-8xl">🖼️</span>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
              <p className="text-white font-semibold">{photos[lightboxIdx].guestName}</p>
              <p className="text-white/60 text-sm">{formatDate(photos[lightboxIdx].uploadedAt)}</p>
            </div>
            <button onClick={closeLightbox} className="absolute top-3 right-3 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
              <X className="w-4 h-4" />
            </button>
            <button className="absolute top-3 left-3 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
              <Download className="w-4 h-4" />
            </button>
          </div>
          <button onClick={e => { e.stopPropagation(); nextPhoto() }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="absolute bottom-4 text-white/50 text-sm">{lightboxIdx + 1} / {photos.length}</p>
        </div>
      )}
    </>
  )
}

'use client'

import { useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { AvatarGroup } from '@/components/ui/Avatar'
import { mockGifts, mockKitties } from '@/lib/mockData'
import type { GiftItem, KittyGoal } from '@/lib/types'
import { Plus, Gift, Heart, Star, Banknote, Users } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/formatDate'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

const STATUS_CONFIG = {
  disponible: { label: 'Disponible', color: 'green' as const },
  reserve: { label: 'Réservé', color: 'amber' as const },
  offert: { label: 'Offert', color: 'gray' as const },
}

function ContributionModal({ kitty, onClose }: { kitty: KittyGoal; onClose: () => void }) {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleContribute = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success(`Merci pour votre contribution de ${amount}€ !`)
    setLoading(false)
    onClose()
  }

  return (
    <Modal open onClose={onClose} title={`Contribuer à "${kitty.name}"`} size="sm" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Annuler</Button>
        <Button loading={loading} onClick={handleContribute}>Contribuer {amount ? `${amount}€` : ''}</Button>
      </>
    }>
      <div className="space-y-4">
        <div className="p-4 bg-rose-50 rounded-xl text-center">
          <p className="text-sm text-rose-700 mb-1">Cagnotte actuelle</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(kitty.currentAmount)}</p>
          <p className="text-sm text-gray-500">sur {formatCurrency(kitty.targetAmount)}</p>
        </div>
        <Input label="Montant (€)" type="number" placeholder="50" value={amount} onChange={e => setAmount(e.target.value)} leftIcon={<Banknote className="w-4 h-4" />} />
        <div className="flex gap-2">
          {[20, 50, 100, 200].map(v => (
            <button key={v} onClick={() => setAmount(String(v))}
              className={cn('flex-1 py-2 rounded-xl text-sm font-medium border transition-colors', amount === String(v) ? 'bg-rose-500 text-white border-rose-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-rose-300')}>
              {v}€
            </button>
          ))}
        </div>
        <Input label="Message (optionnel)" placeholder="Bon voyage !" value={message} onChange={e => setMessage(e.target.value)} />
      </div>
    </Modal>
  )
}

export default function GiftsPage() {
  const [gifts, setGifts] = useState<GiftItem[]>(mockGifts)
  const [kitties] = useState<KittyGoal[]>(mockKitties)
  const [selectedKitty, setSelectedKitty] = useState<KittyGoal | null>(null)
  const [activeTab, setActiveTab] = useState<'gifts' | 'kitty'>('gifts')

  const reserveGift = (id: string) => {
    setGifts(gs => gs.map(g => g.id === id ? { ...g, status: 'reserve', reservedBy: 'Invité anonyme' } : g))
    toast.success('Cadeau réservé !')
  }

  return (
    <>
      <DashboardTopbar title="Cadeaux & Cagnotte" subtitle="Gérez votre liste de cadeaux et vos cagnottes" />
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
          <button onClick={() => setActiveTab('gifts')} className={cn('px-5 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'gifts' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500')}>
            🎁 Liste de cadeaux ({gifts.length})
          </button>
          <button onClick={() => setActiveTab('kitty')} className={cn('px-5 py-2 text-sm font-medium rounded-lg transition-all', activeTab === 'kitty' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500')}>
            💝 Cagnottes ({kitties.length})
          </button>
        </div>

        {activeTab === 'gifts' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge color="green" size="md">{gifts.filter(g => g.status === 'disponible').length} disponibles</Badge>
                <Badge color="amber" size="md">{gifts.filter(g => g.status === 'reserve').length} réservés</Badge>
                <Badge color="gray" size="md">{gifts.filter(g => g.status === 'offert').length} offerts</Badge>
              </div>
              <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">Ajouter un cadeau</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map(gift => {
                const { label, color } = STATUS_CONFIG[gift.status]
                return (
                  <div key={gift.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
                    <div className="h-40 bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center relative">
                      <span className="text-5xl">🎁</span>
                      <div className="absolute top-3 right-3">
                        <Badge color={color} size="sm">{label}</Badge>
                      </div>
                      {gift.status === 'offert' && (
                        <div className="absolute inset-0 bg-gray-200/50 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full px-3 py-1 text-sm font-semibold text-gray-600 line-through">{gift.name}</div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className={cn('font-semibold text-gray-900 mb-1', gift.status === 'offert' && 'line-through text-gray-400')}>{gift.name}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{gift.description}</p>
                      {gift.price && <p className="text-lg font-bold text-rose-600 mb-3">{formatCurrency(gift.price)}</p>}
                      {gift.reservedBy && (
                        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400" />
                          {gift.status === 'offert' ? 'Offert par' : 'Réservé par'} {gift.reservedBy}
                        </p>
                      )}
                      {gift.status === 'disponible' && (
                        <Button fullWidth size="sm" variant="outlined" onClick={() => reserveGift(gift.id)}>
                          Réserver ce cadeau
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {activeTab === 'kitty' && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{kitties.length} cagnotte{kitties.length > 1 ? 's' : ''} active{kitties.length > 1 ? 's' : ''}</p>
              <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">Créer une cagnotte</Button>
            </div>

            <div className="space-y-6">
              {kitties.map(kitty => {
                const pct = Math.round((kitty.currentAmount / kitty.targetAmount) * 100)
                return (
                  <div key={kitty.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-rose-100 to-amber-100 relative flex items-center justify-center">
                      <span className="text-5xl">💝</span>
                      {kitty.isActive && <Badge color="green" size="sm" className="absolute top-3 right-3" dot>Active</Badge>}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-playfair font-bold text-xl text-gray-900 mb-1">{kitty.name}</h3>
                          <p className="text-sm text-gray-500">{kitty.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-3xl font-bold text-rose-600">{pct}%</p>
                          <p className="text-xs text-gray-400">financé</p>
                        </div>
                      </div>

                      <ProgressBar value={kitty.currentAmount} max={kitty.targetAmount} color="rose" size="lg" showLabel showPercentage={false} animated className="mb-4" />

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <AvatarGroup names={kitty.contributors.slice(0, 5).map(c => c.name)} colors={kitty.contributors.map(c => c.avatarColor || '#C9748F')} max={4} size="xs" />
                          <span className="text-sm text-gray-500">{kitty.contributors.length} contributeurs</span>
                        </div>
                        <Button size="sm" onClick={() => setSelectedKitty(kitty)}>
                          Participer
                        </Button>
                      </div>

                      {/* Contributors list */}
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                          <Users className="w-4 h-4" /> Contributions récentes
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {kitty.contributors.map(c => (
                            <div key={c.id} className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: c.avatarColor }}>
                                {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <span className="flex-1 text-gray-700">{c.name}</span>
                              {c.message && <span className="text-xs text-gray-400 italic">"{c.message}"</span>}
                              <span className="font-semibold text-emerald-600">{formatCurrency(c.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {selectedKitty && <ContributionModal kitty={selectedKitty} onClose={() => setSelectedKitty(null)} />}
    </>
  )
}

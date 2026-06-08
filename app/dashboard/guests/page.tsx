'use client'

import { useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { Toggle } from '@/components/ui/Toggle'
import { Select } from '@/components/ui/Dropdown'
import { EmptyState } from '@/components/ui/EmptyState'
import { mockGuests } from '@/lib/mockData'
import type { Guest, RSVPStatus, EventStep } from '@/lib/types'
import { Plus, Search, Download, Bell, Pencil, Trash2, Upload, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

const STEP_LABELS: Record<EventStep, string> = {
  ceremonie: 'Cérémonie',
  mairie: 'Mairie',
  reception: 'Réception',
  soiree: 'Soirée',
  religieux: 'Religieux',
}

const RSVP_COLORS: Record<RSVPStatus, 'green' | 'amber' | 'red'> = {
  accepted: 'green',
  pending: 'amber',
  declined: 'red',
}
const RSVP_LABELS: Record<RSVPStatus, string> = {
  accepted: 'Accepté',
  pending: 'En attente',
  declined: 'Refusé',
}

const tabs = [
  { id: 'all', label: 'Tous', count: mockGuests.length },
  { id: 'accepted', label: 'Acceptés', count: mockGuests.filter(g => g.rsvpStatus === 'accepted').length },
  { id: 'pending', label: 'En attente', count: mockGuests.filter(g => g.rsvpStatus === 'pending').length },
  { id: 'declined', label: 'Refusés', count: mockGuests.filter(g => g.rsvpStatus === 'declined').length },
]

function GuestModal({ guest, onClose, onSave }: { guest?: Partial<Guest>; onClose: () => void; onSave: (g: Partial<Guest>) => void }) {
  const [form, setForm] = useState<Partial<Guest>>(guest || { rsvpStatus: 'pending', steps: [] })

  const STEPS: EventStep[] = ['mairie', 'ceremonie', 'reception', 'soiree']

  const toggleStep = (step: EventStep) => {
    const steps = form.steps || []
    if (steps.includes(step)) setForm({ ...form, steps: steps.filter(s => s !== step) })
    else setForm({ ...form, steps: [...steps, step] })
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={guest?.id ? 'Modifier l\'invité' : 'Ajouter un invité'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={() => { onSave(form); toast.success('Invité sauvegardé !') }}>Sauvegarder</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Prénom" value={form.firstName || ''} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Marie" />
          <Input label="Nom" value={form.lastName || ''} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Dupont" />
        </div>
        <Input label="Email" type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="marie@email.fr" />
        <Input label="Téléphone" type="tel" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+33 6 12 34 56 78" />
        <Select
          label="Statut RSVP"
          value={form.rsvpStatus}
          onChange={v => setForm({ ...form, rsvpStatus: v as RSVPStatus })}
          options={[
            { label: 'En attente', value: 'pending' },
            { label: 'Accepté', value: 'accepted' },
            { label: 'Refusé', value: 'declined' },
          ]}
        />
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Étapes de l'événement</p>
          <div className="flex flex-wrap gap-2">
            {STEPS.map(step => (
              <button
                key={step}
                onClick={() => toggleStep(step)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
                  (form.steps || []).includes(step)
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300',
                )}
              >
                {STEP_LABELS[step]}
              </button>
            ))}
          </div>
        </div>
        <Input label="Groupe familial" value={form.familyGroup || ''} onChange={e => setForm({ ...form, familyGroup: e.target.value })} placeholder="Famille Dupont" />
      </div>
    </Modal>
  )
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>(mockGuests)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editGuest, setEditGuest] = useState<Guest | undefined>()
  const [selected, setSelected] = useState<string[]>([])

  const filtered = guests.filter(g => {
    const matchStatus = filter === 'all' || g.rsvpStatus === filter
    const matchSearch = !search || `${g.firstName} ${g.lastName} ${g.email} ${g.phone}`.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(g => g.id))

  const handleSave = (form: Partial<Guest>) => {
    if (editGuest) {
      setGuests(gs => gs.map(g => g.id === editGuest.id ? { ...g, ...form } : g))
    } else {
      setGuests(gs => [...gs, { ...form, id: `g${Date.now()}`, avatarColor: '#C9748F' } as Guest])
    }
    setShowModal(false)
    setEditGuest(undefined)
  }

  const handleDelete = (id: string) => {
    setGuests(gs => gs.filter(g => g.id !== id))
    toast.success('Invité supprimé')
  }

  return (
    <>
      <DashboardTopbar title="Gestion des invités" subtitle={`${guests.length} invités au total`} />
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">

        {/* Header actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-playfair text-2xl font-bold text-gray-900">Invités</span>
            <Badge color="rose" size="md">{guests.length}</Badge>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outlined" size="sm" leftIcon={<Upload className="w-4 h-4" />}>Importer CSV</Button>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => { setEditGuest(undefined); setShowModal(true) }}>
              Ajouter un invité
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom, email, téléphone..."
              leftIcon={<Search className="w-4 h-4" />}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Tabs tabs={tabs} activeTab={filter} onChange={setFilter} variant="pill" />
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <span className="text-sm font-medium text-rose-700">{selected.length} sélectionné(s)</span>
            <Button size="xs" leftIcon={<Bell className="w-3 h-3" />} onClick={() => toast.success('Rappels envoyés !')}>Envoyer rappel</Button>
            <Button size="xs" variant="outlined" leftIcon={<Download className="w-3 h-3" />}>Exporter</Button>
            <Button size="xs" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => { setGuests(gs => gs.filter(g => !selected.includes(g.id))); setSelected([]); toast.success('Invités supprimés') }}>Supprimer</Button>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left w-10">
                  <input type="checkbox" className="rounded" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} aria-label="Tout sélectionner" />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Invité</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Contact</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Statut RSVP</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Étapes</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState icon={<Users className="w-6 h-6" />} title="Aucun invité trouvé" description="Ajoutez votre premier invité ou modifiez la recherche." />
                  </td>
                </tr>
              ) : filtered.map(guest => (
                <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded" checked={selected.includes(guest.id)} onChange={() => toggleSelect(guest.id)} aria-label={`Sélectionner ${guest.firstName}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={`${guest.firstName} ${guest.lastName}`} size="sm" color={guest.avatarColor} />
                      <div>
                        <p className="font-medium text-gray-900">{guest.firstName} {guest.lastName}</p>
                        {guest.familyGroup && <p className="text-xs text-gray-400">{guest.familyGroup}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <p className="text-sm">{guest.email}</p>
                    <p className="text-xs text-gray-400">{guest.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={RSVP_COLORS[guest.rsvpStatus]} dot>{RSVP_LABELS[guest.rsvpStatus]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {guest.steps.map(step => (
                        <span key={step} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {STEP_LABELS[step]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toast.success(`Rappel envoyé à ${guest.firstName} !`)} aria-label="Envoyer rappel" className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-500 transition-colors">
                        <Bell className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditGuest(guest); setShowModal(true) }} aria-label="Modifier" className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(guest.id)} aria-label="Supprimer" className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filtered.map(guest => (
            <div key={guest.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={`${guest.firstName} ${guest.lastName}`} size="md" color={guest.avatarColor} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{guest.firstName} {guest.lastName}</p>
                  <p className="text-sm text-gray-400">{guest.phone}</p>
                </div>
                <Badge color={RSVP_COLORS[guest.rsvpStatus]} dot size="sm">{RSVP_LABELS[guest.rsvpStatus]}</Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {guest.steps.map(step => (
                  <span key={step} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{STEP_LABELS[step]}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="xs" variant="ghost" leftIcon={<Bell className="w-3 h-3" />} onClick={() => toast.success('Rappel envoyé !')}>Rappel</Button>
                <Button size="xs" variant="ghost" leftIcon={<Pencil className="w-3 h-3" />} onClick={() => { setEditGuest(guest); setShowModal(true) }}>Modifier</Button>
                <Button size="xs" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => handleDelete(guest.id)}>Supprimer</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <GuestModal guest={editGuest} onClose={() => { setShowModal(false); setEditGuest(undefined) }} onSave={handleSave} />
      )}
    </>
  )
}

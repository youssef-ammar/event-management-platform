'use client'

import { useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { mockTables, mockGuests } from '@/lib/mockData'
import type { SeatingTable, Guest } from '@/lib/types'
import { Plus, UserPlus, X, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

export default function SeatingPage() {
  const [tables, setTables] = useState<SeatingTable[]>(mockTables)
  const [guestView, setGuestView] = useState(false)
  const [addTableModal, setAddTableModal] = useState(false)
  const [newTableName, setNewTableName] = useState('')
  const [assignModal, setAssignModal] = useState<{ tableId: string } | null>(null)

  const assignedIds = new Set(tables.flatMap(t => t.guests))
  const unassigned = mockGuests.filter(g => !assignedIds.has(g.id))

  const addTable = () => {
    if (!newTableName.trim()) return
    setTables(ts => [...ts, { id: `t${Date.now()}`, name: newTableName, capacity: 8, guests: [], shape: 'round' }])
    setNewTableName('')
    setAddTableModal(false)
    toast.success('Table ajoutée !')
  }

  const removeGuest = (tableId: string, guestId: string) => {
    setTables(ts => ts.map(t => t.id === tableId ? { ...t, guests: t.guests.filter(g => g !== guestId) } : t))
  }

  const assignGuest = (tableId: string, guestId: string) => {
    setTables(ts => ts.map(t => t.id === tableId ? { ...t, guests: [...t.guests, guestId] } : t))
    setAssignModal(null)
    toast.success('Invité assigné !')
  }

  return (
    <>
      <DashboardTopbar title="Plan de table" subtitle="Organisez les places de vos invités" />
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Badge color="rose" size="md">{tables.length} tables</Badge>
            <Badge color="amber" size="md">{unassigned.length} non placé{unassigned.length !== 1 ? 's' : ''}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" leftIcon={<Eye className="w-4 h-4" />} onClick={() => setGuestView(!guestView)}>
              {guestView ? 'Vue admin' : 'Vue invité'}
            </Button>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setAddTableModal(true)}>
              Ajouter une table
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tables.map(table => {
            const tableGuests = mockGuests.filter(g => table.guests.includes(g.id))
            const emptySeats = table.capacity - tableGuests.length

            return (
              <div key={table.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{table.name}</h3>
                    <Badge color={emptySeats === 0 ? 'red' : emptySeats <= 2 ? 'amber' : 'green'} size="sm">
                      {tableGuests.length}/{table.capacity}
                    </Badge>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: table.capacity }).map((_, i) => (
                      <div key={i} className={cn('h-1.5 flex-1 rounded-full', i < tableGuests.length ? 'bg-rose-400' : 'bg-gray-100')} />
                    ))}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {tableGuests.map(guest => (
                    <div key={guest.id} className="flex items-center gap-2 group">
                      <Avatar name={`${guest.firstName} ${guest.lastName}`} size="xs" color={guest.avatarColor} />
                      <span className="text-sm text-gray-700 flex-1 truncate">{guest.firstName} {guest.lastName}</span>
                      {!guestView && (
                        <button onClick={() => removeGuest(table.id, guest.id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition-all">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {emptySeats > 0 && Array.from({ length: Math.min(emptySeats, 2) }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 opacity-40">
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300" />
                      <span className="text-xs text-gray-400">Siège libre</span>
                    </div>
                  ))}

                  {!guestView && emptySeats > 0 && (
                    <button
                      onClick={() => setAssignModal({ tableId: table.id })}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-dashed border-rose-200 text-rose-500 text-sm hover:bg-rose-50 hover:border-rose-300 transition-all duration-200 mt-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Ajouter un invité
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {/* Unassigned guests pool */}
          {!guestView && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm">
              <div className="p-4 border-b border-amber-200">
                <h3 className="font-semibold text-amber-700">Non placés</h3>
                <p className="text-xs text-amber-500 mt-0.5">{unassigned.length} invité{unassigned.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
                {unassigned.length === 0 ? (
                  <p className="text-sm text-amber-600 text-center py-4">🎉 Tous les invités sont placés !</p>
                ) : unassigned.map(guest => (
                  <div key={guest.id} className="flex items-center gap-2">
                    <Avatar name={`${guest.firstName} ${guest.lastName}`} size="xs" color={guest.avatarColor} />
                    <span className="text-sm text-gray-700 flex-1 truncate">{guest.firstName} {guest.lastName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Table Modal */}
      <Modal open={addTableModal} onClose={() => setAddTableModal(false)} title="Ajouter une table" size="sm"
        footer={<><Button variant="ghost" onClick={() => setAddTableModal(false)}>Annuler</Button><Button onClick={addTable}>Créer</Button></>}>
        <div className="space-y-4">
          <Input label="Nom de la table" placeholder="Table d'honneur" value={newTableName} onChange={e => setNewTableName(e.target.value)} />
          <Input label="Capacité" type="number" placeholder="8" />
        </div>
      </Modal>

      {/* Assign Guest Modal */}
      {assignModal && (
        <Modal open onClose={() => setAssignModal(null)} title="Assigner un invité" size="sm">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {unassigned.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Tous les invités sont déjà placés</p>
            ) : unassigned.map(guest => (
              <button
                key={guest.id}
                onClick={() => assignGuest(assignModal.tableId, guest.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 transition-colors text-left"
              >
                <Avatar name={`${guest.firstName} ${guest.lastName}`} size="sm" color={guest.avatarColor} />
                <div>
                  <p className="font-medium text-sm text-gray-900">{guest.firstName} {guest.lastName}</p>
                  <p className="text-xs text-gray-400">{guest.email}</p>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  )
}

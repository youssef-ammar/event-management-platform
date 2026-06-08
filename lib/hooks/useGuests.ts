'use client'

import { useState, useMemo } from 'react'
import { mockGuests } from '@/lib/mockData'
import type { Guest, RSVPStatus } from '@/lib/types'

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>(mockGuests)
  const [filter, setFilter] = useState<RSVPStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return guests.filter(g => {
      const matchStatus = filter === 'all' || g.rsvpStatus === filter
      const matchSearch = !search || `${g.firstName} ${g.lastName} ${g.email}`.toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [guests, filter, search])

  const stats = useMemo(() => ({
    total: guests.length,
    accepted: guests.filter(g => g.rsvpStatus === 'accepted').length,
    pending: guests.filter(g => g.rsvpStatus === 'pending').length,
    declined: guests.filter(g => g.rsvpStatus === 'declined').length,
  }), [guests])

  const addGuest = (guest: Omit<Guest, 'id'>) => {
    setGuests(gs => [...gs, { ...guest, id: `g${Date.now()}` }])
  }

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    setGuests(gs => gs.map(g => g.id === id ? { ...g, ...updates } : g))
  }

  const deleteGuest = (id: string) => {
    setGuests(gs => gs.filter(g => g.id !== id))
  }

  return { guests, filtered, stats, filter, setFilter, search, setSearch, addGuest, updateGuest, deleteGuest }
}

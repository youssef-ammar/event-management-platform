'use client'

import { useState, useEffect, useMemo } from 'react'
import * as guestsApi from '@/lib/api/guests'
import type { Guest, RSVPStatus } from '@/lib/types'

export function useGuests(eventId: string | undefined) {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<RSVPStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!eventId) return
    setLoading(true)
    guestsApi.listGuests(eventId).then(setGuests).finally(() => setLoading(false))
  }, [eventId])

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

  const addGuest = async (guest: Partial<Guest>) => {
    const created = await guestsApi.createGuest(eventId!, guest)
    setGuests(gs => [...gs, created])
  }

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    const updated = await guestsApi.updateGuest(eventId!, id, updates)
    setGuests(gs => gs.map(g => g.id === id ? updated : g))
  }

  const deleteGuest = async (id: string) => {
    await guestsApi.deleteGuest(eventId!, id)
    setGuests(gs => gs.filter(g => g.id !== id))
  }

  return { guests, filtered, stats, filter, setFilter, search, setSearch, addGuest, updateGuest, deleteGuest, loading }
}

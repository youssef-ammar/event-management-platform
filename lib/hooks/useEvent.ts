'use client'

import { useState, useEffect, useCallback } from 'react'
import { listEvents } from '@/lib/api/events'
import { useAuth } from './useAuth'
import type { Event } from '@/lib/types'

export function useEvent() {
  const { isAuthenticated } = useAuth()
  const [event, setEvent] = useState<Event>()
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      setEvent((await listEvents())[0])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { event, eventId: event?.id, loading, refetch }
}

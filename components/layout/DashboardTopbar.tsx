'use client'

import { Bell, Search, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useEvent } from '@/lib/hooks/useEvent'
import { useAuth } from '@/lib/hooks/useAuth'
import { listNotifications, markRead, markAllRead } from '@/lib/api/notifications'
import { ApiError } from '@/lib/api/client'
import type { Notification } from '@/lib/types'
import { formatRelative } from '@/lib/utils/formatDate'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

interface DashboardTopbarProps {
  title: string
  subtitle?: string
}

export function DashboardTopbar({ title, subtitle }: DashboardTopbarProps) {
  const router = useRouter()
  const { eventId } = useEvent()
  const { user, logout } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!eventId) return
    listNotifications(eventId).then(setNotifications)
  }, [eventId])

  const unread = notifications.filter((n) => !n.read).length

  const handleNotifClick = async (notif: Notification) => {
    if (notif.read || !eventId) return
    try {
      const updated = await markRead(eventId, notif.id)
      setNotifications(ns => ns.map(n => n.id === notif.id ? updated : n))
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue')
    }
  }

  const handleMarkAllRead = async () => {
    if (!eventId) return
    try {
      await markAllRead(eventId)
      setNotifications(ns => ns.map(n => ({ ...n, read: true })))
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div>
        <h1 className="font-playfair font-bold text-xl text-gray-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Search (desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-400 w-52 cursor-pointer hover:border-rose-300 transition-colors">
          <Search className="w-4 h-4 flex-shrink-0" />
          <span>Rechercher…</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false) }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label={`Notifications${unread > 0 ? ` (${unread} non lues)` : ''}`}
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-modal border border-gray-100 animate-slide-down z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-900">Notifications</span>
                {unread > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs text-rose-500 hover:text-rose-600 font-medium">
                    Tout marquer comme lu
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-gray-400 text-center">Aucune notification</p>
                ) : notifications.map((n) => (
                  <div key={n.id} onClick={() => handleNotifClick(n)} className={cn('px-4 py-3 flex gap-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0', !n.read && 'bg-rose-50/50')}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 bg-rose-100">
                      {n.type === 'rsvp' ? '📋' : n.type === 'gift' ? '🎁' : n.type === 'photo' ? '📸' : '💬'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatRelative(n.createdAt)}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Menu utilisateur"
          >
            <Avatar name={user?.name ?? '?'} size="sm" color="#C9748F" />
            <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name?.split(' ')[0] ?? ''}</span>
            <ChevronDown className={cn('w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200', userOpen && 'rotate-180')} />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 animate-slide-down z-50">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">Mon compte</Link>
              <Link href="/" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">Retour au site</Link>
              <div className="border-t border-gray-100 mt-1.5 pt-1.5">
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 text-left">Se déconnecter</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

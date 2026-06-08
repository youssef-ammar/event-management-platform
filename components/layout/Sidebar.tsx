'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard, Users, Mail, MessageSquare, Grid3X3, Camera, Gift, Settings,
  ChevronLeft, ChevronRight, LogOut, User,
} from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/dashboard/guests', icon: Users, label: 'Invités' },
  { href: '/dashboard/invitations', icon: Mail, label: 'Invitations' },
  { href: '/dashboard/messaging', icon: MessageSquare, label: 'Messagerie' },
  { href: '/dashboard/seating', icon: Grid3X3, label: 'Plan de table' },
  { href: '/dashboard/photos', icon: Camera, label: 'Album photo' },
  { href: '/dashboard/gifts', icon: Gift, label: 'Cadeaux & Cagnotte' },
  { href: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 h-screen sticky top-0',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-gray-100', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-[#D4AF7A] flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white font-playfair font-bold text-lg leading-none">f</span>
        </div>
        {!collapsed && (
          <span className="font-playfair font-bold text-lg text-gray-900">
            faire<span className="text-gradient">part</span>
          </span>
        )}
      </div>

      {/* Event badge */}
      {!collapsed && (
        <div className="mx-3 mt-4 px-3 py-2.5 bg-rose-50 rounded-xl border border-rose-100">
          <p className="text-xs text-rose-500 font-medium uppercase tracking-wide mb-0.5">Événement actif</p>
          <p className="text-sm font-semibold text-gray-900 truncate">Sophie & Thomas</p>
          <p className="text-xs text-gray-400">12 Sept. 2026</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center rounded-xl text-sm font-medium transition-all duration-200',
                collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <Icon className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
              {!collapsed && <span>{label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500" />}
            </Link>
          )
        })}
      </nav>

      {/* Collapse button */}
      <div className="px-2 py-3 border-t border-gray-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full flex items-center rounded-xl px-3 py-2.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors text-sm',
            collapsed ? 'justify-center' : 'gap-3',
          )}
          aria-label={collapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Réduire</span></>}
        </button>
      </div>

      {/* User profile */}
      <div className={cn('px-2 py-3 border-t border-gray-100 flex items-center', collapsed ? 'justify-center' : 'gap-3')}>
        <Avatar name="Sophie Martin" size="sm" color="#C9748F" />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Sophie Martin</p>
            <p className="text-xs text-gray-400 truncate">sophie@email.fr</p>
          </div>
        )}
        {!collapsed && (
          <Link href="/auth/login" aria-label="Se déconnecter">
            <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
          </Link>
        )}
      </div>
    </aside>
  )
}

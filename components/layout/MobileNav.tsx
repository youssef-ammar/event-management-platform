'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { LayoutDashboard, Users, Mail, MessageSquare, Grid3X3 } from 'lucide-react'

const mobileNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/guests', icon: Users, label: 'Invités' },
  { href: '/dashboard/invitations', icon: Mail, label: 'Invitations' },
  { href: '/dashboard/messaging', icon: MessageSquare, label: 'Messages' },
  { href: '/dashboard/seating', icon: Grid3X3, label: 'Tables' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 shadow-lg">
      <div className="grid grid-cols-5 h-16">
        {mobileNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors duration-200',
                isActive ? 'text-rose-600' : 'text-gray-400 hover:text-gray-600',
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform duration-200', isActive && 'scale-110')} />
              <span className="text-[10px]">{label}</span>
              {isActive && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-rose-500" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

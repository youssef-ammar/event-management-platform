'use client'

import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Tarif', href: '#pricing' },
  { label: 'Témoignages', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close mobile nav on resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-all duration-500',
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/80'
            : 'bg-transparent',
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="Fairepart — Accueil">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-rose-500 to-[#D4AF7A] group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center h-full text-white font-playfair font-bold text-lg leading-none">f</span>
            </div>
            <span className="font-playfair font-bold text-xl text-gray-900 tracking-tight">
              faire<span className="text-gradient">part</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 group',
                  activeLink === link.href
                    ? 'text-rose-600'
                    : 'text-gray-600 hover:text-gray-900',
                )}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={cn(
                  'absolute inset-0 rounded-full bg-rose-50 transition-all duration-200',
                  activeLink === link.href ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                )} />
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Se connecter</Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="sm"
                className="shadow-md shadow-rose-200/50 hover:shadow-rose-300/60"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Créer votre événement
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn(
              'md:hidden relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200',
              mobileOpen ? 'bg-rose-100 text-rose-600' : 'text-gray-600 hover:bg-gray-100',
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
          >
            <span className={cn('absolute transition-all duration-300', mobileOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90')}>
              <X className="w-5 h-5" />
            </span>
            <span className={cn('absolute transition-all duration-300', mobileOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0')}>
              <Menu className="w-5 h-5" />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={cn('fixed inset-0 z-30 md:hidden transition-all duration-300', mobileOpen ? 'pointer-events-auto' : 'pointer-events-none')}
        onClick={() => setMobileOpen(false)}
      >
        <div className={cn('absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300', mobileOpen ? 'opacity-100' : 'opacity-0')} />
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed top-16 inset-x-0 z-30 md:hidden transition-all duration-400 ease-out',
          mobileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none',
        )}
      >
        <div className="mx-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-5 flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all duration-150"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="px-4 pb-5 pt-1 flex flex-col gap-2 border-t border-gray-100">
            <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" fullWidth size="md">Se connecter</Button>
            </Link>
            <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
              <Button fullWidth size="md" leftIcon={<Sparkles className="w-4 h-4" />}>
                Créer votre événement
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

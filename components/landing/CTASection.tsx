'use client'

import { ArrowRight, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-visible'); o.disconnect() }
    }, { threshold: 0.15 })
    o.observe(el)
    return () => o.disconnect()
  }, [])
  return ref
}

const avatars = [
  { initials: 'SM', color: '#C9748F' },
  { initials: 'JT', color: '#7C3AED' },
  { initials: 'CR', color: '#D4AF7A' },
  { initials: 'IL', color: '#059669' },
  { initials: 'LA', color: '#0891B2' },
]

export function CTASection() {
  const revealRef = useReveal()

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a10] via-[#2d1320] to-[#1a0a10]" />

      {/* Animated gradient mesh */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 30%, #C9748F33 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 70%, #D4AF7A22 0%, transparent 60%)',
        }}
      />

      {/* Morphing blobs */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] animate-blob pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C9748F 0%, transparent 70%)', opacity: 0.12 }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[400px] h-[400px] animate-blob pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4AF7A 0%, transparent 70%)', opacity: 0.1, animationDelay: '-5s' }}
      />

      {/* Floating sparkle dots */}
      {[
        { top: '15%', left: '8%' },
        { top: '25%', right: '10%' },
        { bottom: '30%', left: '15%' },
        { bottom: '20%', right: '18%' },
        { top: '60%', left: '5%' },
        { top: '40%', right: '5%' },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-rose-300/60 pointer-events-none animate-glow-pulse"
          style={{ ...pos, animationDelay: `${i * 0.4}s` } as React.CSSProperties}
        />
      ))}

      {/* Grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="reveal" ref={revealRef}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Commencez gratuitement aujourd'hui
          </div>

          {/* Headline */}
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
            Votre grand jour mérite{' '}
            <br className="hidden sm:block" />
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, #C9748F 0%, #D4AF7A 60%, #C9748F 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 4s ease infinite',
              }}
            >
              la perfection
            </span>
          </h2>

          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Rejoignez 2 800+ couples et professionnels qui ont choisi Fairepart.
            Créez votre invitation en moins de 5 minutes — gratuitement.
          </p>

          {/* Avatar stack + rating */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex -space-x-2.5">
              {avatars.map((a, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-[#2d1320] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ backgroundColor: a.color, zIndex: avatars.length - i }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />)}
              </div>
              <p className="text-white/50 text-xs">2 800+ organisateurs satisfaits</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-[#D4AF7A] text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/30 hover:scale-105 overflow-hidden"
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
              <span className="relative flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Créer mon invitation gratuite
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white font-medium text-sm transition-colors duration-200 group"
            >
              Voir comment ça marche
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Trust micro-copy */}
          <p className="mt-8 text-white/30 text-xs tracking-wide">
            Aucune carte bancaire requise &nbsp;·&nbsp; Accès immédiat &nbsp;·&nbsp; Remboursé sous 14 jours
          </p>
        </div>
      </div>
    </section>
  )
}

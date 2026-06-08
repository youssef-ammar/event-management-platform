'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

/* ─── Reveal hook ─────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-visible'); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ─── Steps data ──────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    emoji: '🎨',
    title: 'Créez votre invitation',
    sub: 'Un faire-part digital qui vous ressemble',
    desc: 'Choisissez parmi des dizaines de modèles élégants, personnalisez les couleurs, polices et animez votre faire-part en quelques clics.',
    tags: ['6 styles de cartes', 'Polices premium', 'Animations intégrées', 'Import design'],
  },
  {
    num: '02',
    emoji: '📨',
    title: 'Envoyez à vos invités',
    sub: 'Chaque invité reçoit un accès unique',
    desc: 'Partagez par SMS, WhatsApp, email ou lien personnalisé. Les rappels automatiques relancent les invités qui n\'ont pas encore répondu.',
    tags: ['SMS & WhatsApp', 'Email élégant', 'Lien personnalisé', 'Rappels automatiques'],
  },
  {
    num: '03',
    emoji: '📊',
    title: 'Gérez tout en temps réel',
    sub: 'Votre tableau de bord tout-en-un',
    desc: 'RSVP, plan de table, messagerie, album photo et liste de cadeaux — centralisés dans un seul endroit, accessibles depuis votre téléphone.',
    tags: ['RSVP en direct', 'Plan de table', 'Album photo', 'Cagnotte & cadeaux'],
  },
]

/* ─── Preview: Step 1 — Create ────────────────────────── */
function CreatePreview() {
  return (
    <div className="p-5 space-y-3.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">Choisir un modèle</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { bg: 'from-pink-100 to-rose-200', name: 'Élégant', sel: true },
          { bg: 'from-purple-100 to-violet-200', name: 'Bohème', sel: false },
          { bg: 'from-amber-100 to-yellow-200', name: 'Doré', sel: false },
          { bg: 'from-sky-100 to-blue-200', name: 'Minimal', sel: false },
        ].map(t => (
          <div
            key={t.name}
            className={cn(
              'relative h-[72px] rounded-xl bg-gradient-to-br flex items-end justify-start p-2.5 border-2 transition-all',
              t.bg,
              t.sel ? 'border-rose-400 shadow-md shadow-rose-100' : 'border-transparent',
            )}
          >
            {t.sel && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center shadow">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            )}
            <span className={cn('text-[10px] font-bold', t.sel ? 'text-rose-700' : 'text-gray-500')}>{t.name}</span>
          </div>
        ))}
      </div>

      <div className="bg-white/80 rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #fce7f3, #fef9ee)' }}>
          💌
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-gray-800 truncate">Sophie &amp; Thomas</p>
          <p className="text-[10px] text-gray-400">12 Septembre 2026 · Versailles</p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
      </div>

      <button
        className="w-full py-2.5 rounded-xl text-white text-[11px] font-bold shadow-sm transition hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #C9748F, #D4AF7A)' }}
      >
        Personnaliser mon faire-part →
      </button>
    </div>
  )
}

/* ─── Preview: Step 2 — Send ──────────────────────────── */
function SendPreview() {
  const avatars = [
    { bg: '#C9748F', initials: 'SM' },
    { bg: '#7C3AED', initials: 'JT' },
    { bg: '#059669', initials: 'CR' },
    { bg: '#D4AF7A', initials: 'IL' },
    { bg: '#2563EB', initials: 'MB' },
  ]
  const channels = [
    { icon: '📱', label: 'SMS',       active: true  },
    { icon: '💬', label: 'WhatsApp',  active: true  },
    { icon: '✉️', label: 'Email',     active: false },
    { icon: '🔗', label: 'Lien',      active: false },
  ]
  return (
    <div className="p-5 space-y-3.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">63 invités</p>
        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">✓ Tous sélectionnés</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex -space-x-2.5">
          {avatars.map((a, i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
              style={{ backgroundColor: a.bg, zIndex: avatars.length - i }}>
              {a.initials}
            </div>
          ))}
        </div>
        <span className="text-[10px] text-gray-400 font-medium">+ 58 autres</span>
      </div>

      <p className="text-[10px] text-gray-500 font-semibold">Envoyer via :</p>
      <div className="grid grid-cols-4 gap-1.5">
        {channels.map(c => (
          <div
            key={c.label}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all',
              c.active ? 'border-rose-200 bg-rose-50/80' : 'border-gray-100 bg-white/60',
            )}
          >
            <span className="text-sm">{c.icon}</span>
            <span className={cn('text-[9px] font-bold', c.active ? 'text-rose-500' : 'text-gray-400')}>{c.label}</span>
          </div>
        ))}
      </div>

      <button
        className="w-full py-2.5 rounded-xl text-white text-[11px] font-bold shadow-sm transition hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #C9748F, #D4AF7A)' }}
      >
        Envoyer les invitations →
      </button>
    </div>
  )
}

/* ─── Preview: Step 3 — Dashboard ────────────────────── */
function DashboardPreview() {
  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">RSVP Live</p>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          En direct
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex gap-px">
        <div className="bg-emerald-400 rounded-l-full transition-all" style={{ width: '30%' }} />
        <div className="bg-amber-300" style={{ width: '57%' }} />
        <div className="bg-red-400 rounded-r-full" style={{ width: '13%' }} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { n: '19', l: 'Acceptés',  bg: 'bg-emerald-50 border-emerald-100', c: 'text-emerald-600' },
          { n: '36', l: 'En attente', bg: 'bg-amber-50  border-amber-100',   c: 'text-amber-600'  },
          { n: '8',  l: 'Refusés',   bg: 'bg-red-50   border-red-100',      c: 'text-red-500'    },
        ].map(s => (
          <div key={s.l} className={`rounded-xl border p-2.5 text-center ${s.bg}`}>
            <p className={`text-xl font-bold font-playfair leading-none ${s.c}`}>{s.n}</p>
            <p className="text-[9px] text-gray-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {[['📸', 'Album'], ['🪑', 'Tables'], ['🎁', 'Cadeaux']].map(([icon, label]) => (
          <div key={label} className="bg-white/80 border border-gray-100 rounded-xl p-2 text-center shadow-sm">
            <span className="text-base">{icon}</span>
            <p className="text-[9px] text-gray-500 font-semibold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2.5 bg-white/80 rounded-xl border border-rose-100 p-2.5 shadow-sm">
        <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-sm flex-shrink-0">✅</div>
        <div>
          <p className="text-[10px] font-bold text-gray-800">Marie D. a accepté</p>
          <p className="text-[9px] text-gray-400">Il y a 2 minutes</p>
        </div>
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
      </div>
    </div>
  )
}

const PREVIEWS = [<CreatePreview key="create" />, <SendPreview key="send" />, <DashboardPreview key="dash" />]

/* ─── Preview window ──────────────────────────────────── */
function PreviewPanel({ active }: { active: number }) {
  const step = STEPS[active]
  return (
    <div className="relative">
      {/* Glow halo */}
      <div
        className="absolute -inset-8 rounded-3xl blur-2xl opacity-30 transition-all duration-700"
        style={{ background: `radial-gradient(ellipse at center, #C9748F 0%, #D4AF7A 50%, transparent 70%)` }}
      />

      {/* Background depth card */}
      <div
        className="absolute inset-2 rounded-3xl border border-white/80"
        style={{ background: 'linear-gradient(135deg, #fff8f5, #fef9f0)', rotate: '3deg', opacity: 0.7 }}
      />

      {/* Main window */}
      <div className="relative rounded-3xl bg-white border border-gray-100/80 shadow-2xl shadow-rose-100/30 overflow-hidden">

        {/* Window chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/80">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-1 text-[10px] text-gray-400 font-medium shadow-sm">
              <span>{step.emoji}</span>
              fairepart.app · {step.num}
            </div>
          </div>
        </div>

        {/* Step content — remounts on step change to trigger animation */}
        <div key={active} className="animate-scale-in">
          {PREVIEWS[active]}
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-2 pb-4 pt-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                background: i === active
                  ? 'linear-gradient(to right, #C9748F, #D4AF7A)'
                  : '#E5E7EB',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Step card ───────────────────────────────────────── */
function StepCard({
  step, index, active,
  onClick,
}: {
  step: typeof STEPS[0]
  index: number
  active: number
  onClick: () => void
}) {
  const isActive = index === active
  const [barKey, setBarKey] = useState(0)

  useEffect(() => {
    if (isActive) setBarKey(k => k + 1)
  }, [isActive])

  return (
    <button className="w-full text-left group" onClick={onClick}>
      <div className={cn(
        'relative rounded-2xl border p-5 transition-all duration-400 overflow-hidden',
        isActive
          ? 'bg-white border-rose-200/60 shadow-xl shadow-rose-100/40'
          : 'bg-white/50 border-gray-100 hover:bg-white hover:border-rose-100 hover:shadow-md',
      )}>

        {/* Active left-side gradient bar */}
        <div
          className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full transition-all duration-500"
          style={{
            background: isActive ? 'linear-gradient(to bottom, #C9748F, #D4AF7A)' : 'transparent',
            opacity: isActive ? 1 : 0,
          }}
        />

        {/* Row: number badge + title */}
        <div className="flex items-center gap-4">
          {/* Number badge */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-playfair font-bold text-base flex-shrink-0 transition-all duration-300 shadow-sm"
            style={isActive
              ? { background: 'linear-gradient(135deg, #C9748F, #D4AF7A)', color: '#fff', boxShadow: '0 4px 14px rgba(201,116,143,0.35)' }
              : { background: '#F9FAFB', color: '#9CA3AF', border: '1px solid #F3F4F6' }
            }
          >
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-400 mb-0.5">{step.num}</p>
            <h3 className={cn(
              'font-semibold text-base leading-snug transition-colors duration-300',
              isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700',
            )}>
              {step.emoji} {step.title}
            </h3>
          </div>

          <ArrowRight className={cn(
            'w-4 h-4 flex-shrink-0 transition-all duration-300',
            isActive ? 'text-rose-400 rotate-90' : 'text-gray-200 group-hover:text-rose-200',
          )} />
        </div>

        {/* Expandable body */}
        <div className={cn(
          'overflow-hidden transition-all duration-500',
          isActive ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0',
        )}>
          <p className="text-sm text-gray-500 leading-relaxed mb-3 pl-[60px]">{step.desc}</p>
          <div className="flex flex-wrap gap-1.5 pl-[60px]">
            {step.tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-full px-2.5 py-1">
                <span className="w-1 h-1 rounded-full bg-rose-400 inline-block" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Auto-advance progress bar */}
        {isActive && (
          <div className="mt-4 h-0.5 bg-gray-100 rounded-full overflow-hidden ml-[60px]">
            <div
              key={barKey}
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(to right, #C9748F, #D4AF7A)',
                animation: 'progressBar 4.2s linear both',
              }}
            />
          </div>
        )}
      </div>
    </button>
  )
}

/* ─── Mobile step row ─────────────────────────────────── */
function MobileStep({ step, index, total }: { step: typeof STEPS[0]; index: number; total: number }) {
  return (
    <div className="flex gap-5 reveal" style={{ transitionDelay: `${index * 0.15}s` }}>
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center font-playfair font-bold text-lg text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #C9748F, #D4AF7A)' }}
        >
          {index + 1}
        </div>
        {index < total - 1 && (
          <div className="w-px flex-1 my-3 bg-gradient-to-b from-rose-300/60 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-2 pt-0.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-400">{step.num}</span>
        <h3 className="font-playfair text-xl font-bold text-gray-900 mt-0.5 mb-2">{step.emoji} {step.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-3">{step.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {step.tags.map(t => (
            <span key={t} className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-full px-2.5 py-1">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Section ─────────────────────────────────────────── */
export function HowItWorksSection() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const headerRef = useReveal()
  const mobileRef = useRef<HTMLDivElement>(null)

  /* Auto-advance */
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setActive(a => (a + 1) % STEPS.length), 4200)
    return () => clearInterval(t)
  }, [paused])

  /* Mobile reveal */
  useEffect(() => {
    const el = mobileRef.current
    if (!el) return
    const items = el.querySelectorAll<HTMLElement>('.reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.1 })
    items.forEach(item => obs.observe(item))
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="how-it-works"
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FDFAF6 0%, #FFF5F8 50%, #FDFAF6 100%)' }}
    >
      {/* Decorative blobs — same as FeaturesSection */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-[0.06] animate-blob"
          style={{ background: 'radial-gradient(circle, #C9748F, transparent 70%)', animationDelay: '2s' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.05] animate-blob"
          style={{ background: 'radial-gradient(circle, #D4AF7A, transparent 70%)', animationDelay: '5s' }} />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ───────────────────────────────────── */}
        <div className="text-center mb-16 reveal" ref={headerRef}>
          <span className="section-tag">✦ Comment ça marche</span>
          <h2 className="font-playfair font-bold text-gray-900 leading-[1.1] mt-3"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
            Simple comme un{' '}
            <span className="italic text-gradient">bonjour</span>
          </h2>
          <p className="section-subtitle">
            De la création de votre invitation à la gestion de votre événement,
            en 3 étapes seulement.
          </p>
        </div>

        {/* ── Desktop layout (lg+) ─────────────────────── */}
        <div className="hidden lg:grid grid-cols-[1fr_480px] gap-14 items-start">

          {/* Left: step cards */}
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <StepCard
                key={i}
                step={step}
                index={i}
                active={active}
                onClick={() => { setActive(i); setPaused(true) }}
              />
            ))}

            {/* CTA row */}
            <div className="pt-4 flex gap-3">
              <Link href="/auth/register">
                <button
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.03]"
                  style={{ background: 'linear-gradient(135deg, #C9748F, #D4AF7A)', boxShadow: '0 8px 24px rgba(201,116,143,0.35)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  Commencer gratuitement
                </button>
              </Link>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-600 border-2 border-gray-200 hover:border-rose-200 hover:text-rose-500 transition-all bg-white/70">
                Voir une démo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: sticky preview panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <PreviewPanel active={active} />
          </div>
        </div>

        {/* ── Mobile layout ────────────────────────────── */}
        <div ref={mobileRef} className="lg:hidden space-y-0">
          {STEPS.map((step, i) => (
            <MobileStep key={i} step={step} index={i} total={STEPS.length} />
          ))}

          {/* Mobile CTA */}
          <div className="pt-8 flex flex-col gap-3 items-center">
            <Link href="/auth/register">
              <button
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-bold shadow-lg"
                style={{ background: 'linear-gradient(135deg, #C9748F, #D4AF7A)', boxShadow: '0 8px 24px rgba(201,116,143,0.35)' }}
              >
                <Sparkles className="w-4 h-4" />
                Commencer gratuitement
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

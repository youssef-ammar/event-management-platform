'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, Play, Star, Sparkles, CheckCircle } from 'lucide-react'
import Link from 'next/link'

/* ─── Event types ──────────────────────────────────────── */
const EVENTS = [
  {
    word: 'mariage',
    emoji: '💍',
    gradient: 'linear-gradient(135deg, #C9748F 0%, #D4AF7A 100%)',
    color1: '#C9748F',
    color2: '#D4AF7A',
    card: {
      gradient: 'linear-gradient(135deg, #fce7f3 0%, #fef9ee 100%)',
      type: 'Mariage',
      name: 'Sophie & Thomas',
      date: '12 Septembre 2026',
      venue: 'Château de Versailles',
    },
  },
  {
    word: 'anniversaire',
    emoji: '🎂',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    color1: '#A855F7',
    color2: '#EC4899',
    card: {
      gradient: 'linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%)',
      type: 'Anniversaire',
      name: '🎂 Les 30 ans de Léa',
      date: '5 Décembre 2026',
      venue: 'Rooftop — Paris 8e',
    },
  },
  {
    word: 'soirée',
    emoji: '🥂',
    gradient: 'linear-gradient(135deg, #D4AF7A 0%, #F59E0B 100%)',
    color1: '#C89A55',
    color2: '#F59E0B',
    card: {
      gradient: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)',
      type: 'Soirée',
      name: '🥂 Soirée Élégance',
      date: '31 Décembre 2026',
      venue: 'Hôtel George V, Paris',
    },
  },
  {
    word: 'fête',
    emoji: '🎉',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
    color1: '#06B6D4',
    color2: '#3B82F6',
    card: {
      gradient: 'linear-gradient(135deg, #cffafe 0%, #dbeafe 100%)',
      type: 'Fête',
      name: '🎉 Grande Fête Annuelle',
      date: '15 Juillet 2026',
      venue: 'Jardin du Palais Royal',
    },
  },
]

/* ─── Floating emoji particles ─────────────────────────── */
const PARTICLES = [
  { content: '💗', x: 6,  y: 18, size: 22, dur: 8,  delay: 0   },
  { content: '⭐', x: 90, y: 14, size: 18, dur: 10, delay: 1.2 },
  { content: '✨', x: 13, y: 68, size: 20, dur: 9,  delay: 2   },
  { content: '💫', x: 84, y: 54, size: 24, dur: 11, delay: 0.5 },
  { content: '🌸', x: 3,  y: 44, size: 20, dur: 7,  delay: 1.5 },
  { content: '💎', x: 93, y: 32, size: 17, dur: 12, delay: 3   },
  { content: '🌟', x: 47, y: 5,  size: 22, dur: 8,  delay: 0.8 },
  { content: '🎊', x: 74, y: 80, size: 20, dur: 10, delay: 2.5 },
  { content: '🌺', x: 21, y: 86, size: 18, dur: 9,  delay: 1.2 },
  { content: '💐', x: 58, y: 6,  size: 22, dur: 13, delay: 0.3 },
  { content: '🎀', x: 39, y: 92, size: 20, dur: 8,  delay: 1.8 },
  { content: '✦',  x: 76, y: 11, size: 16, dur: 6,  delay: 0.6 },
]

/* ─── Brand marquee ────────────────────────────────────── */
const brands = ['Marie Claire', 'ELLE Mariage', 'Le Monde du Mariage', 'Brides', 'Le Salon du Mariage', 'Wedding Magazine']

/* ─── Notification toasts ──────────────────────────────── */
const TOASTS: Array<{ emoji: string; title: string; sub: string; cls: string; pos: React.CSSProperties }> = [
  { emoji: '✅', title: 'Marie D. a accepté',  sub: 'Il y a 2 min',    cls: 'animate-notif-left', pos: { left: '-64px',  top: '80px'    } },
  { emoji: '📸', title: '5 nouvelles photos',  sub: 'Album partagé',    cls: 'animate-notif-in',   pos: { right: '-60px', top: '200px'   } },
  { emoji: '🎁', title: 'Cadeau réservé !',    sub: 'Robot KitchenAid', cls: 'animate-notif-in',   pos: { right: '-60px', bottom: '110px'} },
]

/* ─── Animated counter ─────────────────────────────────── */
function Counter({ target, suffix, color }: { target: number; suffix: string; color: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return
      started.current = true
      obs.disconnect()
      const dur = 1800
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1)
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <span ref={ref} className="font-playfair font-bold text-2xl" style={{ color }}>
      {val.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}

/* ─── Phone mockup ─────────────────────────────────────── */
function PhoneScreen({ ev }: { ev: typeof EVENTS[0] }) {
  return (
    <div
      key={ev.word}
      className="absolute inset-0 overflow-y-auto animate-scale-in"
      style={{ background: 'linear-gradient(180deg, #FFF8FA 0%, #FFFFFF 60%)' }}
    >
      <div className="px-4 pt-12 pb-6 space-y-3">
        {/* App logo row */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: ev.gradient }}>
            <span className="text-white font-playfair font-bold text-xs">f</span>
          </div>
          <span className="font-playfair font-bold text-xs text-gray-800">fairepart</span>
        </div>

        {/* Invitation card */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div className="h-[110px] flex items-center justify-center relative" style={{ background: ev.card.gradient }}>
            {/* Bokeh */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${8 + (i * 6) % 12}px`,
                  height: `${8 + (i * 6) % 12}px`,
                  background: i % 2 ? ev.color1 : ev.color2,
                  opacity: 0.25,
                  top: `${15 + (i * 25) % 65}%`,
                  left: `${8 + (i * 18) % 80}%`,
                }}
              />
            ))}
            <div className="text-center z-10 relative px-3">
              <p className="font-cormorant italic text-[11px] mb-0.5" style={{ color: ev.color1 }}>{ev.card.type}</p>
              <p className="font-playfair font-bold text-gray-800 text-sm leading-tight">{ev.card.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{ev.card.date}</p>
            </div>
          </div>
          <div className="bg-white p-3 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px]">📍</span>
              <span className="text-[10px] text-gray-500">{ev.card.venue}</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full px-2 py-0.5 font-semibold">✓ Invité(e)</span>
              <span className="text-[9px] rounded-full border px-2 py-0.5 font-semibold" style={{ color: ev.color1, background: `${ev.color1}12`, borderColor: `${ev.color1}30` }}>Table 3</span>
              <span className="text-[9px] bg-white border border-gray-100 rounded-full px-2 py-0.5 font-medium text-gray-500">{ev.emoji} {ev.card.type}</span>
            </div>
          </div>
        </div>

        {/* RSVP bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-gray-700">Réponses RSVP</span>
            <span className="text-[9px] font-medium" style={{ color: ev.color1 }}>63 invités</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
            <div className="bg-emerald-400 rounded-l-full" style={{ width: '30%' }} />
            <div className="bg-amber-300" style={{ width: '57%' }} />
            <div className="bg-red-400 rounded-r-full" style={{ width: '13%' }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-emerald-600 font-semibold">19 ✓</span>
            <span className="text-[9px] text-amber-500">36 ⏳</span>
            <span className="text-[9px] text-red-400">8 ✗</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-1.5">
          {['📸 Album', '🎁 Cadeaux', '💬 Chat'].map((item) => (
            <div key={item} className="bg-white rounded-xl p-2 flex flex-col items-center gap-0.5 border border-gray-100 shadow-sm">
              <span className="text-sm">{item.split(' ')[0]}</span>
              <span className="text-[9px] text-gray-500 font-medium">{item.split(' ')[1]}</span>
            </div>
          ))}
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 space-y-1.5">
          <p className="text-[10px] font-semibold text-gray-700 mb-1">Derniers messages</p>
          {['💬 Rappel RSVP envoyé', '📊 Sondage repas — 28 rép.'].map((m) => (
            <div key={m} className="flex items-center gap-2 py-1">
              <span className="text-[11px]">{m.split(' ')[0]}</span>
              <span className="text-[10px] text-gray-500 truncate">{m.slice(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main hero ────────────────────────────────────────── */
export function HeroSection() {
  const [idx, setIdx] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)

  /* Cycle event types */
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % EVENTS.length), 3400)
    return () => clearInterval(t)
  }, [])

  /* Stats reveal */
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-visible'); obs.disconnect() }
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const ev = EVENTS[idx]

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden" style={{ background: 'linear-gradient(160deg, #FDFAF6 0%, #FFF5F8 50%, #FDFAF6 100%)' }}>

      {/* ── Free corner badge ─────────────────────────── */}
      <div className="absolute top-24 right-6 z-50 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
        <div className="relative flex flex-col items-center">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-md scale-110" />
          <div
            className="relative flex flex-col items-center justify-center w-20 h-20 rounded-2xl border border-emerald-200/80 shadow-xl text-center"
            style={{ background: 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 60%, #a7f3d0 100%)' }}
          >
            <span className="text-xl leading-none">🎁</span>
            <span className="mt-1 text-[11px] font-black text-emerald-700 leading-tight tracking-wide uppercase">Gratuit</span>
            <span className="text-[9px] text-emerald-500 font-semibold leading-tight">pour toujours</span>
          </div>
          {/* Animated ping dot */}
          <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow" />
          </span>
        </div>
      </div>

      {/* ── Animated aurora blobs ─────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Color-shifting main blob — changes with event type */}
        <div
          className="absolute -top-56 -left-56 w-[720px] h-[720px] rounded-full animate-blob"
          style={{ background: `radial-gradient(circle, ${ev.color1}22 0%, transparent 70%)`, transition: 'background 1.2s ease' }}
        />
        <div
          className="absolute -bottom-56 -right-56 w-[800px] h-[800px] rounded-full animate-blob"
          style={{ background: `radial-gradient(circle, ${ev.color2}1A 0%, transparent 70%)`, animationDelay: '3s', animationDuration: '14s', transition: 'background 1.2s ease' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-blob"
          style={{ background: 'radial-gradient(circle, #C9748F0D 0%, transparent 70%)', animationDelay: '7s', animationDuration: '17s' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'radial-gradient(circle, #C9748F 1.2px, transparent 1.2px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Diagonal shimmer stripe */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: 'repeating-linear-gradient(135deg, #D4AF7A 0px, transparent 1px, transparent 60px, #D4AF7A 61px)',
          }}
        />
      </div>

      {/* ── Floating emoji particles ───────────────────── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute select-none pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animation: `float ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            opacity: 0.55,
            zIndex: 1,
          }}
        >
          {p.content}
        </div>
      ))}

      {/* ── Main grid ─────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">

          {/* Left: copy ───────────────────────────────── */}
          <div className="text-center lg:text-left">



            {/* Headline */}
            <div className="animate-slide-up">
              <h1 className="font-playfair font-bold leading-[1.05]">
                <span className="block text-4xl md:text-5xl lg:text-[60px] text-gray-700 mb-1">
                  Invitations pour
                </span>

                {/* Cycling event word */}
                <span className="block relative inline-block pb-6">
                  <span
                    key={idx}
                    className="text-5xl md:text-6xl lg:text-[78px] italic animate-slide-up inline-block"
                    style={{
                      background: ev.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {ev.word}
                  </span>
                  {/* Wavy underline */}
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 500 14"
                    fill="none"
                    preserveAspectRatio="none"
                    style={{ height: 12 }}
                  >
                    <path
                      key={idx}
                      d="M2 9 Q60 3 120 9 Q180 15 240 9 Q300 3 360 9 Q420 15 498 9"
                      stroke={ev.color1}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.45"
                    />
                  </svg>
                </span>

                <span className="block text-3xl md:text-4xl lg:text-5xl text-gray-400 font-semibold mt-2">
                  inoubliables ✨
                </span>
              </h1>
            </div>

            {/* Event type selector pills */}
            <div className="mt-7 flex flex-wrap gap-2 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {EVENTS.map((e, i) => (
                <button
                  key={e.word}
                  onClick={() => setIdx(i)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-semibold transition-all duration-400"
                  style={i === idx
                    ? {
                        background: e.gradient,
                        color: '#fff',
                        borderColor: 'transparent',
                        boxShadow: `0 4px 18px ${e.color1}45`,
                        transform: 'scale(1.07)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.85)',
                        color: '#9CA3AF',
                        borderColor: '#E5E7EB',
                      }
                  }
                >
                  {e.emoji} {e.word.charAt(0).toUpperCase() + e.word.slice(1)}
                </button>
              ))}
            </div>

            {/* Subtitle */}
            <p
              className="mt-7 text-lg text-gray-500 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Créez des faire-parts élégants, gérez vos invités et suivez les RSVP en temps réel.
              Pour{' '}
              <span className="font-semibold" style={{ color: ev.color1, transition: 'color 0.8s ease' }}>
                {EVENTS.map(e => e.word).join(', ')}
              </span>{' '}
              et bien plus encore.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/auth/register">
                <button
                  className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm overflow-hidden transition-all duration-300 hover:scale-[1.04]"
                  style={{
                    background: ev.gradient,
                    boxShadow: `0 10px 28px ${ev.color1}45`,
                    transition: 'background 0.8s ease, box-shadow 0.3s ease, transform 0.2s ease',
                  }}
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Créer mon événement
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              <button className="flex items-center justify-center gap-3 px-6 py-3.5 text-gray-700 font-semibold rounded-full border-2 border-gray-200/80 hover:border-gray-300 hover:shadow-md transition-all duration-300 text-sm bg-white/70 backdrop-blur-sm group">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{ background: `${ev.color1}18` }}
                >
                  <Play className="w-3 h-3 fill-current" style={{ color: ev.color1 }} />
                </span>
                Voir une démo
              </button>
            </div>

            {/* Animated stats */}
            <div ref={statsRef} className="reveal mt-9 grid grid-cols-3 gap-3">
              {[
                { value: 2800, suffix: '+', label: 'Événements créés' },
                { value: 180,  suffix: '+', label: 'Invités / mariage' },
                { value: 98,   suffix: '%', label: 'Satisfaction' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="text-center lg:text-left p-3.5 rounded-2xl border border-white/80 bg-white/60 backdrop-blur-sm shadow-sm"
                >
                  <Counter target={s.value} suffix={s.suffix} color={ev.color1} />
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: phone mockup ───────────────────────── */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="relative flex-shrink-0"
              style={{ animation: 'floatSlow 8s ease-in-out infinite' }}
            >
              {/* Glow halo — adapts color */}
              <div
                className="absolute -inset-8 rounded-[4rem]"
                style={{
                  background: `radial-gradient(ellipse at center, ${ev.color1}28 0%, ${ev.color2}10 50%, transparent 70%)`,
                  filter: 'blur(20px)',
                  transition: 'background 1s ease',
                }}
              />

              {/* Secondary decorative card peeking behind */}
              <div
                className="absolute -bottom-4 -right-4 w-[230px] h-[480px] rounded-[2.8rem] border border-white/60 shadow-xl"
                style={{ background: `linear-gradient(160deg, ${ev.color1}15, ${ev.color2}08)`, rotate: '6deg', zIndex: 0 }}
              />

              {/* Phone frame */}
              <div className="relative w-[248px] h-[530px] z-10">
                <div className="absolute inset-0 bg-gray-900 rounded-[2.8rem] shadow-2xl border-[3px] border-gray-800">
                  <div className="absolute inset-[3px] rounded-[2.5rem] overflow-hidden bg-white">
                    {/* Dynamic island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full z-20" />
                    {/* Screen */}
                    <PhoneScreen ev={ev} />
                  </div>
                </div>
                {/* Home bar */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-600/40 rounded-full z-20" />
              </div>

              {/* Event type badge floating above phone */}
              <div
                key={idx}
                className="absolute -top-5 left-1/2 -translate-x-1/2 animate-notif-in z-20 flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold shadow-lg whitespace-nowrap"
                style={{ background: ev.gradient, animationDelay: '0.1s', animationFillMode: 'both' }}
              >
                {ev.emoji} {ev.card.type}
              </div>

              {/* Floating toast notifications */}
              {TOASTS.map((t) => (
                <div
                  key={t.title}
                  className={`absolute glass rounded-xl shadow-xl px-3 py-2.5 flex items-center gap-2.5 min-w-[155px] max-w-[180px] border border-white/80 z-20 ${t.cls}`}
                  style={{ ...t.pos, animationDelay: '0.5s', animationFillMode: 'both' }}
                >
                  <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm flex-shrink-0">
                    {t.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-gray-800 leading-tight">{t.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{t.sub}</p>
                  </div>
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ev.color1 }}>
                    <span className="absolute inset-0 rounded-full" style={{ backgroundColor: ev.color1, animation: 'ping-slow 2s ease-out infinite' }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature pills ─────────────────────────────── */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.45s' }}>
          {[
            { icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'RSVP en temps réel',       dot: '#10b981' },
            { icon: '💬',                                     label: 'Messagerie groupée',        dot: '#6366f1' },
            { icon: '📸',                                     label: 'Album photo partagé',       dot: '#a855f7' },
            { icon: '🎁',                                     label: 'Liste cadeaux & Cagnotte',  dot: '#D4AF7A' },
            { icon: '🪑',                                     label: 'Plan de table interactif',  dot: '#C9748F' },
          ].map((p, i) => (
            <div
              key={i}
              className="group relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-gray-700 bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.11)] hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              style={{ animationDelay: `${0.45 + i * 0.07}s` }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: p.dot, boxShadow: `0 0 0 3px ${p.dot}22` }}
              />
              <span className="flex items-center gap-1.5">
                {typeof p.icon === 'string' ? <span className="text-[13px] leading-none">{p.icon}</span> : <span style={{ color: p.dot }}>{p.icon}</span>}
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Brand marquee ─────────────────────────────── */}
      <div className="relative z-10 w-full border-t border-gray-100 bg-white/55 py-5 mt-6 backdrop-blur-sm">
        <p className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-4">
          Ils nous font confiance
        </p>
        <div className="marquee-outer marquee-pause">
          <div className="marquee-track marquee-run" style={{ '--dur': '30s' } as React.CSSProperties}>
            {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="flex-shrink-0 font-cormorant italic text-xl text-gray-400 font-semibold px-8 select-none"
              >
                {brand}
                <span className="mx-8 not-italic" style={{ color: `${ev.color1}60`, transition: 'color 0.8s ease' }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

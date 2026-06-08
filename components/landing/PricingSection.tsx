'use client'

import { Check, Zap, Star, Building2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('is-visible'); o.disconnect() }
    }, { threshold: 0.1 })
    o.observe(el)
    return () => o.disconnect()
  }, [])
  return ref
}

const plans = [
  {
    name: 'Événement',
    icon: <Zap className="w-5 h-5" />,
    price: '89,99',
    period: 'paiement unique',
    description: 'Idéal pour les petits événements',
    color: 'from-blue-400 to-indigo-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: [
      "Jusqu'à 50 invités",
      'Faire-part personnalisable',
      'Gestion RSVP complète',
      'Messagerie groupée',
      'Album photo (50 photos)',
      'Support email',
    ],
    cta: 'Commencer',
    popular: false,
  },
  {
    name: 'Mariage',
    icon: <Star className="w-5 h-5" />,
    price: '149,99',
    period: 'paiement unique',
    description: 'Le choix de 90% des mariés',
    color: 'from-rose-400 to-[#D4AF7A]',
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    features: [
      "Jusqu'à 300 invités",
      'Faire-part animé premium',
      'Gestion RSVP avancée',
      'Plan de table interactif',
      'Album photo illimité',
      'Liste de cadeaux & Cagnotte',
      "Multi-étapes d'événement",
      'Messagerie & sondages',
      'Support prioritaire 7j/7',
    ],
    cta: 'Créer mon mariage',
    popular: true,
  },
  {
    name: 'Wedding Planner',
    icon: <Building2 className="w-5 h-5" />,
    price: '299,99',
    period: 'par mois',
    description: 'Pour les professionnels',
    color: 'from-gray-700 to-gray-900',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-100',
    features: [
      'Événements illimités',
      'Invités illimités',
      'Toutes les fonctionnalités',
      'Dashboard multi-événements',
      'Personnalisation avancée',
      'API disponible',
      'Support dédié & formation',
      'Facturation client intégrée',
    ],
    cta: "Contacter l'équipe",
    popular: false,
  },
]

export function PricingSection() {
  const revealRef = useReveal()

  return (
    <section id="pricing" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/30 to-white" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

      {/* Blobs */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-rose-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16" ref={revealRef}>
          <span className="section-tag">✦ Tarif</span>
          <h2 className="section-title">
            Un investissement unique,{' '}
            <span className="italic text-gradient">des souvenirs éternels</span>
          </h2>
          <p className="section-subtitle">
            Sans abonnement caché. Payez une fois, profitez toute votre vie.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={cn(
                'reveal relative rounded-3xl flex flex-col overflow-hidden transition-all duration-500',
                `reveal-delay-${i + 1}`,
                plan.popular
                  ? 'ring-2 ring-rose-400 shadow-2xl shadow-rose-200/50 z-10'
                  : 'border border-gray-100 shadow-sm hover:shadow-lg',
                !plan.popular && 'bg-white',
              )}
            >
              {/* Popular gradient header */}
              {plan.popular && (
                <div className="h-2 bg-gradient-to-r from-rose-400 via-pink-400 to-[#D4AF7A]" />
              )}
              {!plan.popular && <div className="h-2 bg-gradient-to-r opacity-40" style={{ background: `linear-gradient(to right, ${plan.color.includes('from-blue') ? '#60A5FA, #818CF8' : '#6B7280, #374151'})` }} />}

              {plan.popular && <div className="bg-gradient-to-br from-[#FFF1F6] to-white flex-1 flex flex-col" />}

              <div className={cn('p-8 flex flex-col h-full', plan.popular ? 'bg-gradient-to-br from-[#FFF5F8] to-white' : 'bg-white')}>

                {/* Plan header */}
                <div className="mb-8">
                  {plan.popular && (
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-[#D4AF7A] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 shadow-sm">
                      <Star className="w-3 h-3 fill-current" /> Plus populaire
                    </div>
                  )}
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', plan.bgColor, plan.textColor)}>
                    {plan.icon}
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="font-playfair text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-400 text-lg mb-1">€</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-medium">{plan.period}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <div className={cn('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', plan.bgColor)}>
                        <Check className={cn('w-3 h-3', plan.textColor)} />
                      </div>
                      <span className="text-sm text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/auth/register">
                  <Button
                    variant={plan.popular ? 'primary' : 'outlined'}
                    fullWidth
                    size="lg"
                    className={plan.popular ? 'shadow-lg shadow-rose-200/60' : ''}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
          {['🔒 Paiement 100% sécurisé', '↩️ Remboursé sous 14 jours', '🚫 Aucun abonnement caché', '⚡ Accès immédiat'].map(b => (
            <span key={b} className="flex items-center gap-1">{b}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

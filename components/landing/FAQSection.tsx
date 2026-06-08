'use client'

import { ChevronDown, MessageCircle } from 'lucide-react'
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

const faqs = [
  {
    q: "Comment fonctionne Fairepart ?",
    a: "Fairepart est une plateforme 100% en ligne qui vous permet de créer votre faire-part digital, envoyer les invitations à vos convives et gérer toute la logistique depuis un seul endroit : RSVP, plan de table, messagerie, album photo et liste de cadeaux.",
  },
  {
    q: "Mes invités doivent-ils créer un compte ?",
    a: "Non ! Vos invités reçoivent un lien personnalisé et peuvent répondre à votre invitation, consulter le plan de table et accéder à l'album photo sans créer de compte. C'est aussi simple pour eux que d'ouvrir un message.",
  },
  {
    q: "Comment puis-je envoyer mes invitations ?",
    a: "Vous pouvez envoyer vos invitations par SMS, WhatsApp, email ou en partageant un lien personnalisé. Chaque invité reçoit une invitation unique avec son propre QR code d'accès.",
  },
  {
    q: "Puis-je importer ma propre liste d'invités ?",
    a: "Oui, vous pouvez importer votre liste d'invités via un fichier CSV ou Excel. Vous pouvez aussi les ajouter manuellement un par un depuis votre tableau de bord.",
  },
  {
    q: "Qu'est-ce que la cagnotte voyage de noces ?",
    a: "La cagnotte vous permet de créer une collecte de fonds pour votre voyage de noces ou tout autre projet. Vos invités peuvent contribuer directement depuis leur invitation, en toute sécurité, avec un paiement par carte bancaire.",
  },
  {
    q: "Le plan de table est-il visible par les invités ?",
    a: "Oui ! Vos invités peuvent consulter leur table assignée depuis leur invitation personnalisée. Ils voient également les autres invités assis à leur table pour faire connaissance avant le grand jour.",
  },
  {
    q: "Combien de photos peuvent soumettre mes invités ?",
    a: "Chaque invité peut soumettre jusqu'à 12 photos dans l'album partagé. En tant qu'organisateur, vous gardez le contrôle sur l'approbation des photos avant qu'elles n'apparaissent à tous.",
  },
  {
    q: "Y a-t-il une limite de temps pour utiliser la plateforme ?",
    a: "Votre compte reste actif pendant 12 mois après la date de votre événement. Vous pouvez télécharger toutes vos données (photos, liste d'invités, réponses) à tout moment.",
  },
  {
    q: "Peut-on utiliser Fairepart pour d'autres événements que les mariages ?",
    a: "Absolument ! Fairepart est conçu pour tout type d'événement : anniversaires, naissances, baptêmes, bar mitzvahs, soirées d'entreprise et bien plus encore.",
  },
  {
    q: "Quelle est votre politique de remboursement ?",
    a: "Nous offrons un remboursement intégral dans les 14 jours suivant l'achat, sans condition. Si vous n'êtes pas satisfait pour quelque raison que ce soit, contactez notre support et nous vous remboursons immédiatement.",
  },
]

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        'reveal border rounded-2xl overflow-hidden transition-all duration-300',
        `reveal-delay-${Math.min(index % 4 + 1, 4)}`,
        open ? 'border-rose-200 shadow-sm bg-rose-50/30' : 'border-gray-100 bg-white hover:border-rose-100',
      )}
    >
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className={cn('font-medium text-sm md:text-base leading-snug transition-colors duration-200', open ? 'text-rose-700' : 'text-gray-800 group-hover:text-rose-600')}>
          {faq.q}
        </span>
        <span className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300',
          open ? 'bg-rose-500 text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-rose-100 group-hover:text-rose-500',
        )}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>
      <div className={cn('overflow-hidden transition-all duration-400 ease-in-out', open ? 'max-h-64' : 'max-h-0')}>
        <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-rose-100 pt-4">
          {faq.a}
        </p>
      </div>
    </div>
  )
}

export function FAQSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const revealRef = useReveal()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const items = container.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target) } })
    }, { threshold: 0.05 })
    items.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="faq" className="py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16" ref={revealRef}>
          <span className="section-tag">✦ FAQ</span>
          <h2 className="section-title">
            Questions{' '}
            <span className="italic text-gradient">fréquentes</span>
          </h2>
          <p className="section-subtitle">
            Vous ne trouvez pas votre réponse ? Contactez-nous directement.
          </p>
        </div>

        <div ref={containerRef} className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* CTA to contact */}
        <div className="mt-12 text-center p-8 rounded-3xl bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
          <p className="text-gray-500 text-sm mb-5">Notre équipe vous répond en moins de 2 heures via WhatsApp.</p>
          <a
            href="https://wa.me/33600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold px-6 py-3 rounded-full text-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-200/60 hover:scale-105"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            Nous contacter sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

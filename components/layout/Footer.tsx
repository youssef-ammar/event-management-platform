import Link from 'next/link'
import { Instagram, Twitter, Facebook, Youtube, Heart } from 'lucide-react'

const nav = {
  fonctionnalites: [
    { label: 'RSVP & Save the Date', href: '#features' },
    { label: 'Faire-part personnalisable', href: '#features' },
    { label: 'Gestion des invités', href: '#features' },
    { label: 'Messagerie & Sondages', href: '#features' },
    { label: 'Plan de table', href: '#features' },
    { label: 'Album photo', href: '#features' },
    { label: 'Liste de cadeaux & Cagnotte', href: '#features' },
  ],
  tarifs: [
    { label: 'Offre Événement', href: '#pricing' },
    { label: 'Offre Mariage', href: '#pricing' },
    { label: 'Wedding Planner Pro', href: '#pricing' },
    { label: 'Comparer les offres', href: '#pricing' },
  ],
  ressources: [
    { label: 'FAQ', href: '#faq' },
    { label: 'Blog & Conseils', href: '#' },
    { label: 'Démo interactive', href: '#' },
    { label: 'Support WhatsApp', href: '#' },
    { label: 'Mentions légales', href: '#' },
    { label: 'Politique de confidentialité', href: '#' },
  ],
}

const socials = [
  { icon: <Instagram className="w-4 h-4" />, label: 'Instagram', href: '#' },
  { icon: <Facebook className="w-4 h-4" />, label: 'Facebook', href: '#' },
  { icon: <Twitter className="w-4 h-4" />, label: 'Twitter', href: '#' },
  { icon: <Youtube className="w-4 h-4" />, label: 'YouTube', href: '#' },
]

const badges = ['🔒 SSL Sécurisé', '🇫🇷 Données en France', '✓ RGPD Conforme']

export function Footer() {
  return (
    <footer className="relative bg-[#0f0710] text-gray-400 overflow-hidden">
      {/* Top gradient fade from last section */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Subtle background accent */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, #C9748F 0%, transparent 60%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">

          {/* Brand col (spans 2 on lg) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-[#D4AF7A] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-playfair font-bold text-xl leading-none">f</span>
              </div>
              <span className="font-playfair font-bold text-2xl text-white tracking-tight">fairepart</span>
            </Link>

            <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-xs">
              La plateforme tout-en-un pour créer, envoyer et gérer vos invitations digitales et événements — 100% en ligne.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2 mb-8">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/5 hover:border-rose-500/30 flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {badges.map(b => (
                <span key={b} className="text-[11px] text-gray-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Fonctionnalités */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-xs uppercase tracking-[0.15em]">Fonctionnalités</h4>
            <ul className="space-y-3">
              {nav.fonctionnalites.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-rose-400 transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tarifs */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-xs uppercase tracking-[0.15em]">Tarifs</h4>
            <ul className="space-y-3">
              {nav.tarifs.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-rose-400 transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-xs uppercase tracking-[0.15em]">Ressources</h4>
            <ul className="space-y-3">
              {nav.ressources.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-500 hover:text-rose-400 transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Language selector */}
            <div className="mt-8">
              <select
                className="text-xs bg-white/5 border border-white/10 text-gray-400 rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500/50 w-full"
                aria-label="Sélectionner la langue"
                defaultValue="fr"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
                <option value="ar">🇹🇳 العربية</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2026 Fairepart. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">
            Fait avec <Heart className="w-3 h-3 text-rose-500 fill-current" /> en France
          </p>
        </div>
      </div>
    </footer>
  )
}

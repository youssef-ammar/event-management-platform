'use client'

import { useEffect, useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Dropdown'
import { Tabs } from '@/components/ui/Tabs'
import { listInvitationStyles } from '@/lib/api/invitationStyles'
import { createMessage } from '@/lib/api/messages'
import { useEvent } from '@/lib/hooks/useEvent'
import { ApiError } from '@/lib/api/client'
import { formatDate } from '@/lib/utils/formatDate'
import type { InvitationStyle } from '@/lib/types'
import { Send, ZoomIn, ZoomOut, Eye, Save, Upload, Check, Sparkles, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

const FONT_OPTIONS = [
  { label: 'Playfair Display', value: 'playfair' },
  { label: 'Cormorant Garamond', value: 'cormorant' },
  { label: 'Inter', value: 'inter' },
]

const COLOR_SWATCHES = ['#C9748F', '#D4AF7A', '#7C3AED', '#2563EB', '#059669', '#DC2626', '#1A1A2E', '#6B7280']

const FONT_FAMILY_TO_KEY: Record<string, string> = {
  'Playfair Display': 'playfair',
  'Cormorant Garamond': 'cormorant',
  'Inter': 'inter',
}

function fontClassFromKey(key: string) {
  return key === 'playfair' ? 'font-playfair' : key === 'cormorant' ? 'font-cormorant' : 'font-inter'
}

const PATTERN_LABELS: Record<string, string> = {
  floral: 'Floral',
  geometric: 'Géométrique',
  botanical: 'Botanique',
  minimal: 'Épuré',
  soft: 'Doux',
  rustic: 'Champêtre',
}

// No real template thumbnails ship with the app, so each style's card and
// live preview render a lightweight CSS pattern instead of a broken image.
function patternBackground(pattern: string | undefined, color: string): React.CSSProperties {
  switch (pattern) {
    case 'floral':
      return {
        backgroundImage: `radial-gradient(circle at 18% 28%, ${color}40 0 3px, transparent 4px), radial-gradient(circle at 58% 12%, ${color}30 0 2.5px, transparent 3.5px), radial-gradient(circle at 82% 52%, ${color}40 0 3px, transparent 4px), radial-gradient(circle at 32% 78%, ${color}30 0 2.5px, transparent 3.5px), radial-gradient(circle at 78% 86%, ${color}40 0 3px, transparent 4px), radial-gradient(circle at 8% 60%, ${color}26 0 2px, transparent 3px)`,
      }
    case 'geometric':
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${color}2e 0 2px, transparent 2px 14px)`,
      }
    case 'botanical':
      return {
        backgroundImage: `radial-gradient(ellipse 65% 45% at 8% -5%, ${color}38 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 105% 105%, ${color}30 0%, transparent 60%)`,
      }
    case 'soft':
      return {
        backgroundImage: `radial-gradient(circle at 50% 15%, ${color}2c 0%, transparent 55%)`,
      }
    case 'rustic':
      return {
        backgroundImage: `repeating-linear-gradient(90deg, ${color}1c 0 1px, transparent 1px 7px), repeating-linear-gradient(0deg, ${color}1c 0 1px, transparent 1px 7px)`,
      }
    case 'minimal':
    default:
      return {}
  }
}

export default function InvitationsPage() {
  const { event, eventId } = useEvent()
  const [styles, setStyles] = useState<InvitationStyle[]>([])
  const [selectedStyle, setSelectedStyle] = useState<InvitationStyle>()
  const [selectedColor, setSelectedColor] = useState('#C9748F')
  const [selectedFont, setSelectedFont] = useState('playfair')
  const [guestView, setGuestView] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [sendModal, setSendModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendChannel, setSendChannel] = useState<'sms' | 'whatsapp' | 'email' | 'link' | 'facebook'>('whatsapp')
  const [mobileTab, setMobileTab] = useState<'preview' | 'edit'>('preview')
  const [celebrate, setCelebrate] = useState(false)

  const [form, setForm] = useState({
    coupleNames: 'Sophie & Thomas',
    date: '12 septembre 2026',
    venue: 'Château de Versailles',
    time: '14h00',
    dressCode: 'Tenue de cérémonie',
    message: 'C\'est avec une immense joie que nous vous invitons à partager ce moment unique.',
  })

  useEffect(() => {
    listInvitationStyles().then(list => {
      setStyles(list)
      if (list.length > 0) {
        setSelectedStyle(list[0])
        setSelectedColor(list[0].primaryColor)
      }
    })
  }, [])

  useEffect(() => {
    if (!event) return
    setForm(f => ({
      ...f,
      coupleNames: event.coupleNames ?? event.name,
      date: formatDate(event.date),
      venue: event.venue,
    }))
  }, [event])

  const handleSend = async () => {
    if (!eventId) return
    setLoading(true)
    try {
      await createMessage(eventId, { type: 'message', content: form.message, channel: sendChannel })

      if (sendChannel === 'facebook' && event?.token) {
        const inviteUrl = `${window.location.origin}/invite/${event.token}`
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}`,
          '_blank',
          'noopener,noreferrer,width=600,height=520'
        )
      }

      toast.success('Invitations envoyées avec succès !')
      setSendModal(false)
      setMobileTab('preview')
      setCelebrate(true)
      setTimeout(() => setCelebrate(false), 1900)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const fontClass = selectedFont === 'playfair' ? 'font-playfair' : selectedFont === 'cormorant' ? 'font-cormorant' : 'font-inter'

  return (
    <>
      <DashboardTopbar title="Invitation Builder" subtitle="Personnalisez et envoyez votre faire-part" />

      {/* Mobile section switcher */}
      <div className="lg:hidden sticky top-16 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <Tabs
          variant="pill"
          tabs={[
            { id: 'preview', label: 'Aperçu', icon: <Eye className="w-3.5 h-3.5" /> },
            { id: 'edit', label: 'Personnaliser', icon: <Sparkles className="w-3.5 h-3.5" /> },
          ]}
          activeTab={mobileTab}
          onChange={(id) => setMobileTab(id as 'preview' | 'edit')}
        />
      </div>

      <div className="lg:flex lg:h-[calc(100vh-64px)] lg:overflow-hidden">

        {/* Left panel: customization */}
        <div className={cn(
          'w-full lg:w-80 lg:flex-shrink-0 bg-white lg:border-r border-gray-100 lg:overflow-y-auto p-5 pb-28 lg:pb-5 space-y-6',
          mobileTab === 'edit' ? 'block' : 'hidden lg:block',
        )}>
          {/* Style picker */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Style de carte</h3>
            <p className="text-xs text-gray-400 mb-3">Choisissez un modèle, sa police et son motif s&apos;appliquent automatiquement — libre à vous d&apos;ajuster ensuite.</p>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((style, i) => {
                const styleFontKey = FONT_FAMILY_TO_KEY[style.fontFamily] ?? 'inter'
                return (
                  <button
                    key={style.id}
                    onClick={() => { setSelectedStyle(style); setSelectedColor(style.primaryColor); setSelectedFont(styleFontKey) }}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className={cn('animate-fade-in aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all duration-200 relative group',
                      selectedStyle?.id === style.id ? 'border-rose-500 ring-2 ring-rose-200 scale-[1.03]' : 'border-gray-200 hover:border-rose-300 hover:-translate-y-0.5'
                    )}
                    aria-label={`Style ${style.name} — ${style.fontFamily}, motif ${PATTERN_LABELS[style.backgroundPattern ?? ''] ?? style.backgroundPattern}`}
                    title={`${style.name} · ${style.fontFamily}`}
                  >
                    <div
                      className="w-full h-full relative transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `linear-gradient(135deg, ${style.primaryColor}1a, white)`, ...patternBackground(style.backgroundPattern, style.primaryColor) }}
                    >
                      {style.thumbnailUrl && (
                        <img
                          src={style.thumbnailUrl}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      )}
                      {!style.thumbnailUrl && (
                        <span className={cn('absolute inset-0 flex items-center justify-center text-xl font-semibold', fontClassFromKey(styleFontKey))} style={{ color: style.primaryColor }}>Aa</span>
                      )}
                    </div>
                    {selectedStyle?.id === style.id && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center animate-scale-in">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </span>
                    )}
                    <p className="absolute bottom-1 inset-x-1 text-center text-[9px] font-medium text-gray-600 bg-white/80 rounded py-0.5 truncate px-1">{style.name}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Font picker */}
          <div>
            <Select label="Police" value={selectedFont} onChange={setSelectedFont} options={FONT_OPTIONS} />
            <p className="text-xs text-gray-400 mt-1.5">Se réajuste si vous changez de modèle ci-dessus.</p>
          </div>

          {/* Color picker */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Couleur principale</h3>
            <div className="flex gap-2 flex-wrap">
              {COLOR_SWATCHES.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn('w-8 h-8 rounded-full border-2 transition-all duration-200', selectedColor === color ? 'border-gray-900 scale-125 shadow-lg' : 'border-white shadow-sm hover:scale-110')}
                  style={{ backgroundColor: color, boxShadow: selectedColor === color ? `0 0 0 3px white, 0 0 0 5px ${color}66` : undefined }}
                  aria-label={`Couleur ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Content fields */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Contenu</h3>
            <div className="space-y-3">
              <Input label="Noms" value={form.coupleNames} onChange={e => setForm(f => ({ ...f, coupleNames: e.target.value }))} />
              <Input label="Date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              <Input label="Lieu" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
              <Input label="Heure" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              <Input label="Dress code" value={form.dressCode} onChange={e => setForm(f => ({ ...f, dressCode: e.target.value }))} />
              <Textarea label="Message" rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} maxLength={200} characterCount={form.message.length} />
            </div>
          </div>

          {/* Import */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Importer un design</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-rose-300 hover:bg-rose-50/30 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Glissez un fichier ou cliquez</p>
              <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG acceptés</p>
            </div>
          </div>
        </div>

        {/* Right panel: Preview */}
        <div className={cn(
          'relative flex-1 gradient-hero flex flex-col overflow-hidden',
          mobileTab === 'preview' ? 'block' : 'hidden lg:flex',
        )}>
          {/* Preview toolbar */}
          <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button onClick={() => setGuestView(!guestView)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors', guestView ? 'bg-rose-500 text-white border-rose-500' : 'text-gray-600 border-gray-200 hover:border-rose-300')}>
                <Eye className="w-4 h-4" /> <span className="hidden sm:inline">{guestView ? 'Vue invité' : 'Vue organisateur'}</span>
              </button>
              {selectedStyle && (
                <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 border border-gray-200 text-gray-500">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selectedColor }} />
                  {selectedStyle.name}
                </span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 rounded-lg border border-gray-200 hover:border-rose-300 text-gray-600 transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-1.5 rounded-lg border border-gray-200 hover:border-rose-300 text-gray-600 transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <Button size="sm" variant="outlined" leftIcon={<Save className="w-4 h-4" />} onClick={() => toast.success('Brouillon sauvegardé')}>
                Sauvegarder
              </Button>
              <Button size="sm" leftIcon={<Send className="w-4 h-4" />} onClick={() => setSendModal(true)}>
                Envoyer les invitations
              </Button>
            </div>
          </div>

          {/* Decorative floating blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full blur-3xl opacity-30 animate-float" style={{ background: selectedColor, animationDelay: '0s' }} />
            <div className="absolute bottom-0 -right-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-float" style={{ background: '#D4AF7A', animationDelay: '1.5s' }} />
            <Sparkles className="hidden sm:block absolute top-24 left-[15%] w-5 h-5 text-champagne-400 opacity-60 animate-float" style={{ animationDelay: '0.6s' }} />
            <Heart className="hidden sm:block absolute bottom-32 right-[18%] w-5 h-5 opacity-50 animate-float" style={{ color: selectedColor, animationDelay: '2s' }} />
          </div>

          {/* Preview area */}
          <div className="relative z-10 flex-1 overflow-auto flex items-center justify-center p-6 sm:p-8">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s' }} className="animate-scale-in">
              {/* Phone frame */}
              <div className="relative w-72 h-[580px] animate-float" style={{ animationDuration: '7s' }}>
                <div
                  className="absolute inset-0 bg-gray-900 rounded-[3rem] border-4 border-gray-800 transition-shadow duration-500"
                  style={{ boxShadow: `0 25px 60px -12px ${selectedColor}55, 0 10px 24px rgba(0,0,0,0.25)` }}
                >
                  <div className="absolute inset-2 rounded-[2.5rem] overflow-hidden transition-all duration-500" style={{ background: `linear-gradient(160deg, ${selectedColor}15 0%, white 50%, ${selectedColor}08 100%)` }}>
                    {/* Template pattern */}
                    <div className="absolute inset-0 transition-opacity duration-500" style={patternBackground(selectedStyle?.backgroundPattern, selectedColor)} />

                    {/* Dynamic island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-full z-10" />

                    {/* Invitation card content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="absolute top-0 inset-x-0 h-40 opacity-20 transition-colors duration-500" style={{ background: `linear-gradient(to bottom, ${selectedColor}, transparent)` }} />

                      <p className="text-xs font-medium uppercase tracking-widest mb-3 mt-10 transition-colors duration-500" style={{ color: selectedColor }}>
                        {guestView ? 'Vous êtes invité(e) !' : 'Aperçu invitation'}
                      </p>

                      <h2 className={cn('text-3xl font-bold text-gray-900 mb-1 transition-all duration-300', fontClass)}>
                        {form.coupleNames.split('&')[0]?.trim()}
                      </h2>
                      <p className="text-lg text-gray-500 mb-1">&</p>
                      <h2 className={cn('text-3xl font-bold text-gray-900 mb-4 transition-all duration-300', fontClass)}>
                        {form.coupleNames.split('&')[1]?.trim()}
                      </h2>

                      <div className="w-12 h-0.5 mx-auto mb-4 transition-colors duration-500" style={{ backgroundColor: selectedColor }} />

                      <p className="text-sm font-semibold text-gray-800 mb-1">{form.date}</p>
                      <p className="text-xs text-gray-500 mb-1">{form.time}</p>
                      <p className="text-xs text-gray-500 mb-4">{form.venue}</p>

                      <p className="text-xs text-gray-400 leading-relaxed mb-5 italic">&ldquo;{form.message}&rdquo;</p>

                      <div className="flex gap-2">
                        <button className="px-4 py-2 text-xs font-semibold rounded-full text-white transition-all duration-300 hover:scale-105" style={{ backgroundColor: selectedColor, boxShadow: `0 4px 14px ${selectedColor}55` }}>
                          ✓ J&apos;y serai !
                        </button>
                        <button className="px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 hover:scale-105" style={{ borderColor: selectedColor, color: selectedColor }}>
                          Je ne peux pas
                        </button>
                      </div>

                      <p className="text-xs text-gray-400 mt-4">👗 {form.dressCode}</p>
                    </div>

                    {/* Send celebration */}
                    {celebrate && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm animate-fade-in overflow-hidden">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <span
                            key={i}
                            className="absolute top-1/3 w-2 h-2 rounded-sm animate-confetti"
                            style={{
                              left: `${8 + (i * 6) % 84}%`,
                              backgroundColor: COLOR_SWATCHES[i % COLOR_SWATCHES.length],
                              animationDelay: `${(i % 6) * 80}ms`,
                            }}
                          />
                        ))}
                        <div className="relative w-16 h-16 rounded-full flex items-center justify-center animate-scale-in" style={{ backgroundColor: selectedColor }}>
                          <svg viewBox="0 0 24 24" className="w-8 h-8">
                            <path d="M4 12l5 5L20 6" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                              strokeDasharray="100" className="animate-check-draw" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-20 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 flex items-center gap-2">
        <Button variant="outlined" size="sm" className="flex-1" leftIcon={<Save className="w-4 h-4" />} onClick={() => toast.success('Brouillon sauvegardé')}>
          Sauvegarder
        </Button>
        <Button size="sm" className="flex-1" leftIcon={<Send className="w-4 h-4" />} onClick={() => setSendModal(true)}>
          Envoyer
        </Button>
      </div>

      {/* Send Modal */}
      <Modal open={sendModal} onClose={() => setSendModal(false)} title="Envoyer les invitations" size="md" footer={
        <><Button variant="ghost" onClick={() => setSendModal(false)}>Annuler</Button><Button loading={loading} onClick={handleSend} leftIcon={<Send className="w-4 h-4" />}>Envoyer maintenant</Button></>
      }>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Canal d&apos;envoi</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['whatsapp', 'sms', 'email', 'link', 'facebook'] as const).map(ch => (
                <button
                  key={ch}
                  onClick={() => setSendChannel(ch)}
                  className={cn('py-3 rounded-xl text-xs font-medium border-2 transition-all', sendChannel === ch ? 'border-rose-500 bg-rose-50 text-rose-700 scale-105' : 'border-gray-200 text-gray-600 hover:border-rose-200')}
                >
                  {ch === 'whatsapp' ? '💬 WhatsApp' : ch === 'sms' ? '📱 SMS' : ch === 'email' ? '📧 Email' : ch === 'link' ? '🔗 Lien' : '📘 Facebook'}
                </button>
              ))}
            </div>
            {sendChannel === 'facebook' && (
              <p className="text-xs text-gray-400 mt-2">Une fenêtre Facebook s&apos;ouvrira pour partager le lien de votre invitation.</p>
            )}
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">Message d&apos;envoi</p>
            <p className="text-sm text-gray-500">{form.coupleNames} vous invitent à leur événement le {form.date} ! Consultez votre invitation personnalisée ici : [lien]</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-xl">
            <span>📩</span>
            <span>{event?.totalGuests ?? 0} invités recevront cette invitation</span>
          </div>
        </div>
      </Modal>
    </>
  )
}

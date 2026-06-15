'use client'

import { useEffect, useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Dropdown'
import { listInvitationStyles } from '@/lib/api/invitationStyles'
import { createMessage } from '@/lib/api/messages'
import { useEvent } from '@/lib/hooks/useEvent'
import { ApiError } from '@/lib/api/client'
import { formatDate } from '@/lib/utils/formatDate'
import type { InvitationStyle } from '@/lib/types'
import { Send, ZoomIn, ZoomOut, Eye, Save, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

const FONT_OPTIONS = [
  { label: 'Playfair Display', value: 'playfair' },
  { label: 'Cormorant Garamond', value: 'cormorant' },
  { label: 'Inter', value: 'inter' },
]

const COLOR_SWATCHES = ['#C9748F', '#D4AF7A', '#7C3AED', '#2563EB', '#059669', '#DC2626', '#1A1A2E', '#6B7280']

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
  const [sendChannel, setSendChannel] = useState<'sms' | 'whatsapp' | 'email' | 'link'>('whatsapp')

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
      await createMessage(eventId, { type: 'message', content: form.message })
      toast.success('Invitations envoyées avec succès !')
      setSendModal(false)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DashboardTopbar title="Invitation Builder" subtitle="Personnalisez et envoyez votre faire-part" />
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">

        {/* Left panel */}
        <div className="w-80 flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto p-5 space-y-6">
          {/* Style picker */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Style de carte</h3>
            <div className="grid grid-cols-3 gap-2">
              {styles.map(style => (
                <button
                  key={style.id}
                  onClick={() => { setSelectedStyle(style); setSelectedColor(style.primaryColor) }}
                  className={cn('aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all duration-200 relative',
                    selectedStyle?.id === style.id ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-200 hover:border-rose-300'
                  )}
                  aria-label={`Style ${style.name}`}
                >
                  <div className="w-full h-full flex items-center justify-center text-2xl" style={{ background: `linear-gradient(135deg, ${style.primaryColor}20, white)` }}>
                    💌
                  </div>
                  <p className="absolute bottom-1 inset-x-1 text-center text-[9px] font-medium text-gray-600 bg-white/80 rounded py-0.5">{style.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Font picker */}
          <div>
            <Select label="Police" value={selectedFont} onChange={setSelectedFont} options={FONT_OPTIONS} />
          </div>

          {/* Color picker */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Couleur principale</h3>
            <div className="flex gap-2 flex-wrap">
              {COLOR_SWATCHES.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn('w-8 h-8 rounded-full border-2 transition-all duration-200', selectedColor === color ? 'border-gray-900 scale-110' : 'border-white shadow-sm hover:scale-105')}
                  style={{ backgroundColor: color }}
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
            </div>
          </div>

          {/* Import */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Importer un design</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-rose-300 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Glissez un fichier ou cliquez</p>
              <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG acceptés</p>
            </div>
          </div>
        </div>

        {/* Right panel: Preview */}
        <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
          {/* Preview toolbar */}
          <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setGuestView(!guestView)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors', guestView ? 'bg-rose-500 text-white border-rose-500' : 'text-gray-600 border-gray-200 hover:border-rose-300')}>
                <Eye className="w-4 h-4" /> {guestView ? 'Vue invité' : 'Vue organisateur'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 rounded-lg border border-gray-200 hover:border-rose-300 text-gray-600 transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-1.5 rounded-lg border border-gray-200 hover:border-rose-300 text-gray-600 transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outlined" leftIcon={<Save className="w-4 h-4" />} onClick={() => toast.success('Brouillon sauvegardé')}>
                Sauvegarder
              </Button>
              <Button size="sm" leftIcon={<Send className="w-4 h-4" />} onClick={() => setSendModal(true)}>
                Envoyer les invitations
              </Button>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-8">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s' }}>
              {/* Phone frame */}
              <div className="relative w-72 h-[580px]">
                <div className="absolute inset-0 bg-gray-900 rounded-[3rem] shadow-2xl border-4 border-gray-800">
                  <div className="absolute inset-2 rounded-[2.5rem] overflow-hidden" style={{ background: `linear-gradient(160deg, ${selectedColor}15 0%, white 50%, ${selectedColor}08 100%)` }}>
                    {/* Dynamic island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-full z-10" />

                    {/* Invitation card content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="absolute top-0 inset-x-0 h-40 opacity-20" style={{ background: `linear-gradient(to bottom, ${selectedColor}, transparent)` }} />

                      <p className="text-xs font-medium uppercase tracking-widest mb-3 mt-10" style={{ color: selectedColor }}>
                        {guestView ? 'Vous êtes invité(e) !' : 'Aperçu invitation'}
                      </p>

                      <h2 className={cn('text-3xl font-bold text-gray-900 mb-1', selectedFont === 'playfair' ? 'font-playfair' : selectedFont === 'cormorant' ? 'font-cormorant' : 'font-inter')}>
                        {form.coupleNames.split('&')[0]?.trim()}
                      </h2>
                      <p className="text-lg text-gray-500 mb-1">&</p>
                      <h2 className={cn('text-3xl font-bold text-gray-900 mb-4', selectedFont === 'playfair' ? 'font-playfair' : selectedFont === 'cormorant' ? 'font-cormorant' : 'font-inter')}>
                        {form.coupleNames.split('&')[1]?.trim()}
                      </h2>

                      <div className="w-12 h-0.5 mx-auto mb-4" style={{ backgroundColor: selectedColor }} />

                      <p className="text-sm font-semibold text-gray-800 mb-1">{form.date}</p>
                      <p className="text-xs text-gray-500 mb-1">{form.time}</p>
                      <p className="text-xs text-gray-500 mb-4">{form.venue}</p>

                      <p className="text-xs text-gray-400 leading-relaxed mb-5 italic">"{form.message}"</p>

                      <div className="flex gap-2">
                        <button className="px-4 py-2 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: selectedColor }}>
                          ✓ J'y serai !
                        </button>
                        <button className="px-4 py-2 text-xs font-semibold rounded-full border" style={{ borderColor: selectedColor, color: selectedColor }}>
                          Je ne peux pas
                        </button>
                      </div>

                      <p className="text-xs text-gray-400 mt-4">👗 {form.dressCode}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Modal */}
      <Modal open={sendModal} onClose={() => setSendModal(false)} title="Envoyer les invitations" size="md" footer={
        <><Button variant="ghost" onClick={() => setSendModal(false)}>Annuler</Button><Button loading={loading} onClick={handleSend} leftIcon={<Send className="w-4 h-4" />}>Envoyer maintenant</Button></>
      }>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Canal d'envoi</p>
            <div className="grid grid-cols-4 gap-2">
              {(['whatsapp', 'sms', 'email', 'link'] as const).map(ch => (
                <button
                  key={ch}
                  onClick={() => setSendChannel(ch)}
                  className={cn('py-3 rounded-xl text-sm font-medium border-2 transition-all', sendChannel === ch ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-gray-200 text-gray-600 hover:border-rose-200')}
                >
                  {ch === 'whatsapp' ? '💬 WhatsApp' : ch === 'sms' ? '📱 SMS' : ch === 'email' ? '📧 Email' : '🔗 Lien'}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">Message d'envoi</p>
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

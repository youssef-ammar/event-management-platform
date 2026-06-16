'use client'

import { useEffect, useState } from 'react'
import { getInvite, getGuestByEmail, getPublicTables, submitRsvp } from '@/lib/api/invite'
import { ApiError } from '@/lib/api/client'
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'
import { AVATAR_COLORS } from '@/lib/constants'
import type { Event, EventStep, EventType, Guest, PublicSeatingTable, RSVPStatus } from '@/lib/types'
import { MapPin, Clock, Calendar, Check, X, Mail } from 'lucide-react'
import { formatDate } from '@/lib/utils/formatDate'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

const STEP_LABELS: Record<EventStep, string> = {
  ceremonie: 'Cérémonie laïque',
  mairie: 'Mairie',
  reception: 'Réception',
  soiree: 'Soirée',
  religieux: 'Cérémonie religieuse',
}

const STEP_ICONS: Record<EventStep, string> = {
  ceremonie: '💐', mairie: '🏛️', reception: '🥂', soiree: '🎊', religieux: '⛪',
}

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  mariage: 'Mariage',
  anniversaire: 'Anniversaire',
  naissance: 'Naissance',
  autre: 'Événement',
}

type RSVPAnswers = Partial<Record<EventStep, 'yes' | 'no'>>

export default function InvitePageClient({ token }: { token: string }) {
  const [event, setEvent] = useState<Event>()
  const [eventLoading, setEventLoading] = useState(true)
  const [tables, setTables] = useState<PublicSeatingTable[]>([])

  const [inviteEmails, setInviteEmails] = useLocalStorage<Record<string, string>>('fairepart_invite_emails', {})
  const [guest, setGuest] = useState<Guest>()
  const [guestLoading, setGuestLoading] = useState(true)
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')
  const [checkingEmail, setCheckingEmail] = useState(false)

  const [rsvp, setRsvp] = useState<RSVPAnswers>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [view, setView] = useState<'invitation' | 'seating'>('invitation')

  useEffect(() => {
    getInvite(token).then(setEvent).finally(() => setEventLoading(false))
    getPublicTables(token).then(setTables).catch(() => {})
  }, [token])

  useEffect(() => {
    const email = inviteEmails[token]
    if (!email) {
      setGuestLoading(false)
      return
    }
    setGuestLoading(true)
    getGuestByEmail(token, email)
      .then(setGuest)
      .catch(() => setInviteEmails(m => {
        const rest = { ...m }
        delete rest[token]
        return rest
      }))
      .finally(() => setGuestLoading(false))
  }, [token, inviteEmails[token]])

  const handleEmailSubmit = async () => {
    if (!emailInput.trim()) return
    setCheckingEmail(true)
    setEmailError('')
    try {
      const g = await getGuestByEmail(token, emailInput.trim())
      setGuest(g)
      setInviteEmails(m => ({ ...m, [token]: emailInput.trim() }))
    } catch {
      setEmailError('Aucun invité trouvé avec cet email.')
    } finally {
      setCheckingEmail(false)
    }
  }

  const handleSubmit = async () => {
    if (!guest) return
    setSubmitting(true)
    try {
      const steps = (Object.entries(rsvp) as [EventStep, 'yes' | 'no'][]).filter(([, v]) => v === 'yes').map(([k]) => k)
      const rsvpStatus: RSVPStatus = steps.length > 0 ? 'accepted' : 'declined'
      await submitRsvp(token, guest.id, { rsvpStatus, steps, dietaryRestrictions: guest.dietaryRestrictions })
      setSubmitted(true)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  if (eventLoading || guestLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 flex items-center justify-center px-4">
        <p className="text-gray-400 animate-pulse">Chargement de votre invitation…</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 flex items-center justify-center px-4 text-center">
        <div>
          <p className="text-4xl mb-3">😕</p>
          <h1 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Invitation introuvable</h1>
          <p className="text-gray-500 text-sm">Ce lien d'invitation n'est pas valide.</p>
        </div>
      </div>
    )
  }

  if (!guest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100 p-8 max-w-sm w-full text-center animate-fade-in">
          <p className="font-cormorant italic text-rose-400 text-lg mb-1">{EVENT_TYPE_LABELS[event.type]}</p>
          <h1 className="font-playfair text-2xl font-bold text-gray-800 mb-6">{event.coupleNames ?? event.name}</h1>
          <p className="text-sm text-gray-600 mb-4">Pour accéder à votre invitation, merci de saisir votre adresse email.</p>
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="vous@email.fr"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
              />
            </div>
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            <button
              onClick={handleEmailSubmit}
              disabled={checkingEmail || !emailInput.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-rose-500 to-[#D4AF7A] text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {checkingEmail ? 'Vérification…' : 'Accéder à mon invitation'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const guestTable = tables.find(t => t.guests.some(g => g.id === guest.id))
  const tablemates = guestTable ? guestTable.guests.filter(g => g.id !== guest.id) : []
  const answeredAll = guest.steps.every(step => rsvp[step] !== undefined)

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm animate-scale-in">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-30" />
            <Check className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">Merci ! 🎉</h1>
          <p className="text-gray-600 text-lg mb-4">
            À bientôt, <span className="font-semibold text-rose-600">{guest.firstName}</span> !
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Votre réponse a bien été enregistrée. Nous avons hâte de vous retrouver pour ce moment inoubliable.
          </p>
          <div className="mt-8 p-4 bg-white rounded-2xl shadow-sm border border-rose-100">
            <p className="font-playfair italic text-rose-500">{event.coupleNames ?? event.name}</p>
            <p className="text-sm text-gray-500 mt-1">{formatDate(event.date)}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50/30 to-amber-50/50 relative overflow-hidden">
      {/* Decorative petals / bokeh */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20 pointer-events-none"
          style={{
            width: `${20 + (i * 13) % 40}px`,
            height: `${20 + (i * 13) % 40}px`,
            background: i % 2 === 0 ? '#C9748F' : '#D4AF7A',
            top: `${(i * 17) % 90}%`,
            left: `${(i * 23) % 90}%`,
            filter: 'blur(8px)',
            animation: `float ${4 + i}s ease-in-out ${i * 0.5}s infinite`,
          }}
        />
      ))}

      <div className="relative max-w-lg mx-auto px-4 py-12 pb-24">

        {/* Header card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-rose-100 overflow-hidden mb-6 animate-fade-in">
          {/* Cover */}
          <div className="h-48 bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute w-3 h-3 bg-rose-400 rounded-full" style={{ top: `${20 + i * 10}%`, left: `${5 + i * 12}%` }} />
              ))}
            </div>
            <div className="text-center z-10">
              <p className="font-cormorant italic text-rose-400 text-lg mb-1">{EVENT_TYPE_LABELS[event.type]}</p>
              <h1 className="font-playfair text-4xl font-bold text-gray-800">{event.coupleNames ?? event.name}</h1>
              <div className="w-16 h-0.5 bg-[#D4AF7A] mx-auto mt-3" />
            </div>
          </div>

          <div className="p-6">
            <p className="font-cormorant italic text-gray-600 text-lg text-center mb-6">
              C'est avec une immense joie que nous vous invitons à partager ce moment unique avec nous.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500"><Calendar className="w-4 h-4" /></div>
                <span className="text-sm font-medium">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500"><MapPin className="w-4 h-4" /></div>
                <span className="text-sm font-medium">{event.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center mb-6">
          <p className="text-rose-700 font-medium">
            💌 Bonjour <span className="font-bold">{guest.firstName} {guest.lastName}</span> !
          </p>
          <p className="text-rose-500 text-sm mt-1">Nous vous attendons avec impatience.</p>
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-white/80 rounded-xl border border-gray-100 shadow-sm">
          <button onClick={() => setView('invitation')} className={cn('flex-1 py-2 text-sm font-medium rounded-lg transition-all', view === 'invitation' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            💌 Mon invitation
          </button>
          <button onClick={() => setView('seating')} className={cn('flex-1 py-2 text-sm font-medium rounded-lg transition-all', view === 'seating' ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
            🪑 Ma table
          </button>
        </div>

        {view === 'invitation' && (
          <>
            {/* Event steps */}
            <div className="space-y-4 mb-6">
              {event.steps.filter(step => (guest.steps as string[]).includes(step.id)).map(step => (
                <div key={step.id} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{STEP_ICONS[step.id as EventStep]}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{STEP_LABELS[step.id as EventStep] || step.label}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {step.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {step.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* RSVP buttons */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Vous y allez ?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setRsvp(r => ({ ...r, [step.id]: 'yes' }))}
                          className={cn('flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200',
                            rsvp[step.id as EventStep] === 'yes'
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                              : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                          )}
                        >
                          <Check className="w-4 h-4" /> Oui, j'y serai !
                        </button>
                        <button
                          onClick={() => setRsvp(r => ({ ...r, [step.id]: 'no' }))}
                          className={cn('flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200',
                            rsvp[step.id as EventStep] === 'no'
                              ? 'bg-red-100 border-red-400 text-red-600'
                              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          )}
                        >
                          <X className="w-4 h-4" /> Je ne peux pas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Practical info */}
            <div className="bg-white/90 rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Informations pratiques</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>👗 <strong>Dress code :</strong> Tenue de cérémonie</li>
                <li>🅿️ <strong>Parking :</strong> Parking gratuit sur place</li>
                <li>🏨 <strong>Hébergement :</strong> Chambres disponibles sur demande</li>
                <li>📸 <strong>Photo :</strong> Partagez vos photos dans notre album</li>
              </ul>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => setView('seating')} className="bg-white/90 rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-xl">🪑</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Ma table</p>
                  <p className="text-xs text-gray-400">{guestTable?.name || 'À attribuer'}</p>
                </div>
              </button>
              <button className="bg-white/90 rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">📸</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Album photo</p>
                  <p className="text-xs text-gray-400">Partagez vos photos</p>
                </div>
              </button>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!answeredAll || submitting}
              className={cn(
                'w-full py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-lg',
                answeredAll
                  ? 'bg-gradient-to-r from-rose-500 to-[#D4AF7A] text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {answeredAll ? (submitting ? 'Envoi…' : '✨ Confirmer mes réponses') : `Répondre à toutes les étapes (${Object.keys(rsvp).length}/${guest.steps.length})`}
            </button>
          </>
        )}

        {view === 'seating' && (
          <div className="space-y-4">
            {guestTable ? (
              <>
                <div className="bg-white/90 rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                  <p className="text-5xl mb-4">🪑</p>
                  <p className="text-sm font-medium text-gray-500 mb-1">Vous êtes à la</p>
                  <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-1">{guestTable.name}</h2>
                  <p className="text-sm text-gray-400">{guestTable.guests.length} personnes à cette table</p>
                </div>

                <div className="bg-white/90 rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Vos voisins de table</h3>
                  <div className="space-y-3">
                    {tablemates.map((tm, idx) => (
                      <div key={tm.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
                          {tm.firstName[0]}{tm.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{tm.firstName} {tm.lastName}</p>
                        </div>
                      </div>
                    ))}
                    {tablemates.length === 0 && <p className="text-sm text-gray-400 text-center">Voisins à venir…</p>}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/90 rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-4xl mb-3">⏳</p>
                <h3 className="font-semibold text-gray-900">Plan de table en cours</h3>
                <p className="text-sm text-gray-500 mt-2">Les organisateurs préparent le plan de table. Revenez bientôt !</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

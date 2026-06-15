'use client'

import { useEffect, useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { Select } from '@/components/ui/Dropdown'
import { Skeleton } from '@/components/ui/Skeleton'
import { useEvent } from '@/lib/hooks/useEvent'
import { useAuth } from '@/lib/hooks/useAuth'
import { getSettings, updateSettings } from '@/lib/api/settings'
import { updateEvent } from '@/lib/api/events'
import { ApiError } from '@/lib/api/client'
import type { EventType } from '@/lib/types'
import toast from 'react-hot-toast'
import { Bell, Shield, Palette, User, Calendar } from 'lucide-react'

const sections = [
  { id: 'event', label: 'Événement', icon: Calendar },
  { id: 'profile', label: 'Mon profil', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'privacy', label: 'Confidentialité', icon: Shield },
]

export default function SettingsPage() {
  const { event, eventId, loading: eventLoading, refetch } = useEvent()
  const { user, updateProfile } = useAuth()
  const [activeSection, setActiveSection] = useState('event')
  const [saving, setSaving] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(true)

  const [settings, setSettings] = useState({
    eventName: '',
    eventType: 'mariage' as EventType,
    eventDate: '',
    venue: '',
    guestLimit: '',
    notifEmail: true,
    notifSMS: true,
    notifRSVP: true,
    notifPhoto: false,
    notifGift: true,
    photoApproval: true,
    publicAlbum: false,
    showGuestList: false,
    language: 'fr',
    theme: 'light',
  })

  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '' })

  useEffect(() => {
    if (!event) return
    setSettings(s => ({
      ...s,
      eventName: event.name,
      eventType: event.type,
      eventDate: event.date.slice(0, 10),
      venue: event.venue,
    }))
  }, [event])

  useEffect(() => {
    if (!eventId) return
    setSettingsLoading(true)
    getSettings(eventId).then(dto => {
      setSettings(s => ({
        ...s,
        guestLimit: dto.guestLimit ? String(dto.guestLimit) : '',
        notifEmail: dto.notifEmail,
        notifSMS: dto.notifSMS,
        notifRSVP: dto.notifRSVP,
        notifPhoto: dto.notifPhoto,
        notifGift: dto.notifGift,
        photoApproval: dto.photoApproval,
        publicAlbum: dto.publicAlbum,
        showGuestList: dto.showGuestList,
        language: dto.language,
        theme: dto.theme,
      }))
    }).finally(() => setSettingsLoading(false))
  }, [eventId])

  useEffect(() => {
    if (!user) return
    const [firstName, ...rest] = user.name.split(' ')
    setProfile({ firstName, lastName: rest.join(' '), phone: user.phone ?? '' })
  }, [user])

  const save = async () => {
    if (!eventId) return
    setSaving(true)
    try {
      await Promise.all([
        updateEvent(eventId, {
          name: settings.eventName,
          type: settings.eventType,
          date: settings.eventDate,
          venue: settings.venue,
        }),
        updateSettings(eventId, {
          guestLimit: settings.guestLimit ? Number(settings.guestLimit) : undefined,
          notifEmail: settings.notifEmail,
          notifSMS: settings.notifSMS,
          notifRSVP: settings.notifRSVP,
          notifPhoto: settings.notifPhoto,
          notifGift: settings.notifGift,
          photoApproval: settings.photoApproval,
          publicAlbum: settings.publicAlbum,
          showGuestList: settings.showGuestList,
          language: settings.language,
          theme: settings.theme,
        }),
        updateProfile({ name: `${profile.firstName} ${profile.lastName}`.trim(), phone: profile.phone }),
      ])
      await refetch()
      toast.success('Paramètres sauvegardés !')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  const initials = (user?.name ?? '')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const loading = eventLoading || settingsLoading

  return (
    <>
      <DashboardTopbar title="Paramètres" subtitle="Configurez votre événement et votre compte" />
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        <div className="flex gap-6">
          {/* Left nav */}
          <div className="w-56 flex-shrink-0 hidden md:block">
            <nav className="space-y-1">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeSection === id ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
            {loading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
                {activeSection === 'event' && (
                  <div className="p-6">
                    <h2 className="font-playfair text-xl font-bold text-gray-900 mb-6">Paramètres de l'événement</h2>
                    <div className="space-y-5">
                      <Input label="Nom de l'événement" value={settings.eventName} onChange={e => setSettings(s => ({ ...s, eventName: e.target.value }))} />
                      <Select label="Type d'événement" value={settings.eventType} onChange={v => setSettings(s => ({ ...s, eventType: v as EventType }))}
                        options={[{ label: 'Mariage', value: 'mariage' }, { label: 'Anniversaire', value: 'anniversaire' }, { label: 'Naissance', value: 'naissance' }, { label: 'Autre', value: 'autre' }]} />
                      <Input label="Date de l'événement" type="date" value={settings.eventDate} onChange={e => setSettings(s => ({ ...s, eventDate: e.target.value }))} />
                      <Input label="Lieu" value={settings.venue} onChange={e => setSettings(s => ({ ...s, venue: e.target.value }))} />
                      <Input label="Limite d'invités" type="number" value={settings.guestLimit} onChange={e => setSettings(s => ({ ...s, guestLimit: e.target.value }))} />
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 font-medium mb-4 text-red-600">Zone dangereuse</p>
                        <Button variant="danger" size="sm">Supprimer l'événement</Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'notifications' && (
                  <div className="p-6">
                    <h2 className="font-playfair text-xl font-bold text-gray-900 mb-6">Notifications</h2>
                    <div className="space-y-5">
                      {[
                        { key: 'notifEmail', label: 'Notifications par email', desc: 'Recevez les mises à jour par email' },
                        { key: 'notifSMS', label: 'Notifications par SMS', desc: 'Recevez les alertes importantes par SMS' },
                        { key: 'notifRSVP', label: 'Nouvelles réponses RSVP', desc: 'Notifier à chaque nouvelle réponse' },
                        { key: 'notifPhoto', label: 'Nouvelles photos', desc: 'Notifier quand des photos sont soumises' },
                        { key: 'notifGift', label: 'Cadeaux réservés', desc: 'Notifier quand un cadeau est réservé' },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-sm text-gray-900">{label}</p>
                            <p className="text-xs text-gray-500">{desc}</p>
                          </div>
                          <Toggle
                            checked={settings[key as keyof typeof settings] as boolean}
                            onChange={v => setSettings(s => ({ ...s, [key]: v }))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'privacy' && (
                  <div className="p-6">
                    <h2 className="font-playfair text-xl font-bold text-gray-900 mb-6">Confidentialité</h2>
                    <div className="space-y-5">
                      {[
                        { key: 'photoApproval', label: 'Approbation des photos', desc: 'Les photos doivent être approuvées avant d\'apparaître dans l\'album' },
                        { key: 'publicAlbum', label: 'Album public', desc: 'Les photos sont visibles par tous les invités sans connexion' },
                        { key: 'showGuestList', label: 'Afficher la liste des invités', desc: 'Les invités peuvent voir qui d\'autre est invité' },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-sm text-gray-900">{label}</p>
                            <p className="text-xs text-gray-500">{desc}</p>
                          </div>
                          <Toggle
                            checked={settings[key as keyof typeof settings] as boolean}
                            onChange={v => setSettings(s => ({ ...s, [key]: v }))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'profile' && (
                  <div className="p-6">
                    <h2 className="font-playfair text-xl font-bold text-gray-900 mb-6">Mon profil</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center text-white text-xl font-bold">{initials}</div>
                        <Button variant="outlined" size="sm">Changer la photo</Button>
                      </div>
                      <Input label="Prénom" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
                      <Input label="Nom" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
                      <Input label="Email" type="email" value={user?.email ?? ''} disabled />
                      <Input label="Téléphone" type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                  </div>
                )}

                {activeSection === 'appearance' && (
                  <div className="p-6">
                    <h2 className="font-playfair text-xl font-bold text-gray-900 mb-6">Apparence</h2>
                    <div className="space-y-4">
                      <Select label="Langue" value={settings.language} onChange={v => setSettings(s => ({ ...s, language: v }))}
                        options={[{ label: '🇫🇷 Français', value: 'fr' }, { label: '🇬🇧 English', value: 'en' }]} />
                      <Select label="Thème" value={settings.theme} onChange={v => setSettings(s => ({ ...s, theme: v }))}
                        options={[{ label: 'Clair', value: 'light' }, { label: 'Sombre', value: 'dark' }, { label: 'Système', value: 'system' }]} />
                    </div>
                  </div>
                )}

                <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                  <Button loading={saving} onClick={save}>Sauvegarder les modifications</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

'use client'

import { useState } from 'react'
import { DashboardTopbar } from '@/components/layout/DashboardTopbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { Select } from '@/components/ui/Dropdown'
import toast from 'react-hot-toast'
import { Bell, Shield, Palette, Globe, User, Calendar } from 'lucide-react'

const sections = [
  { id: 'event', label: 'Événement', icon: Calendar },
  { id: 'profile', label: 'Mon profil', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'privacy', label: 'Confidentialité', icon: Shield },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('event')
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    eventName: 'Mariage Sophie & Thomas',
    eventType: 'mariage',
    eventDate: '2026-09-12',
    venue: 'Château de Versailles',
    guestLimit: '300',
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

  const save = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast.success('Paramètres sauvegardés !')
  }

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
            {activeSection === 'event' && (
              <div className="p-6">
                <h2 className="font-playfair text-xl font-bold text-gray-900 mb-6">Paramètres de l'événement</h2>
                <div className="space-y-5">
                  <Input label="Nom de l'événement" value={settings.eventName} onChange={e => setSettings(s => ({ ...s, eventName: e.target.value }))} />
                  <Select label="Type d'événement" value={settings.eventType} onChange={v => setSettings(s => ({ ...s, eventType: v }))}
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
                    <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center text-white text-xl font-bold">SM</div>
                    <Button variant="outlined" size="sm">Changer la photo</Button>
                  </div>
                  <Input label="Prénom" defaultValue="Sophie" />
                  <Input label="Nom" defaultValue="Martin" />
                  <Input label="Email" type="email" defaultValue="sophie@email.fr" />
                  <Input label="Téléphone" type="tel" defaultValue="+33 6 12 34 56 78" />
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
          </div>
        </div>
      </div>
    </>
  )
}

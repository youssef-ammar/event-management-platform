'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Eye, EyeOff, Mail, Lock, User, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/lib/hooks/useAuth'
import { createEvent } from '@/lib/api/events'
import { ApiError } from '@/lib/api/client'
import type { EventType } from '@/lib/types'

const EVENT_TYPES = [
  { value: 'mariage', emoji: '💍', label: 'Mariage', desc: 'Cérémonie de mariage' },
  { value: 'anniversaire', emoji: '🎂', label: 'Anniversaire', desc: 'Fête d\'anniversaire' },
  { value: 'naissance', emoji: '👶', label: 'Naissance', desc: 'Naissance ou baptême' },
  { value: 'autre', emoji: '🎉', label: 'Autre', desc: 'Autre événement' },
]

const STEPS = ['Votre compte', 'Votre événement', 'Finalisation']

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    eventType: '', eventName: '', eventDate: '', venue: '', guestCount: 50, heardFrom: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!form.firstName) e.firstName = 'Prénom requis'
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide'
      if (!form.password || form.password.length < 8) e.password = 'Au moins 8 caractères'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    if (step === 1) {
      if (!form.eventType) e.eventType = 'Choisissez un type d\'événement'
      if (!form.eventName) e.eventName = 'Nom de l\'événement requis'
      if (!form.eventDate) e.eventDate = 'Date requise'
      if (!form.venue) e.venue = 'Lieu requis'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => Math.min(2, s + 1)) }
  const prev = () => setStep(s => Math.max(0, s - 1))

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await register(`${form.firstName} ${form.lastName}`.trim(), form.email, form.password)
      try {
        await createEvent({
          name: form.eventName,
          type: form.eventType as EventType,
          date: form.eventDate,
          venue: form.venue,
          steps: [],
        })
      } catch {
        toast('Compte créé. Configurez votre événement dans Paramètres.', { icon: '⚠️' })
      }
      setCompleted(true)
      setTimeout(() => { toast.success('Compte créé !'); router.push('/dashboard') }, 2500)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 40 40" className="w-12 h-12">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#10B981" strokeWidth="3" />
              <path d="M10 20 L17 27 L30 14" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="30" strokeDashoffset="0" className="animate-check-draw" />
            </svg>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">Parfait !</h1>
          <p className="text-gray-500">Votre événement a été créé avec succès.</p>
          <p className="text-gray-400 text-sm mt-2">Redirection vers votre tableau de bord…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-[#D4AF7A] flex items-center justify-center shadow-md">
                <span className="text-white font-playfair font-bold text-lg leading-none">f</span>
              </div>
              <span className="font-playfair font-bold text-xl text-gray-900">faire<span className="text-gradient">part</span></span>
            </Link>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((label, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    i < step ? 'bg-rose-500 text-white' : i === step ? 'bg-rose-500 text-white ring-4 ring-rose-100' : 'bg-gray-100 text-gray-400'
                  )}>
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div className={cn('h-0.5 w-10 sm:w-20 transition-all duration-500', i < step ? 'bg-rose-400' : 'bg-gray-200')} />}
                </div>
              ))}
            </div>
            <p className="text-center text-sm font-medium text-gray-600 mt-2">{STEPS[step]}</p>
          </div>

          {/* Step 1 */}
          {step === 0 && (
            <div className="space-y-4 animate-slide-up">
              <h2 className="font-playfair text-xl font-bold text-gray-900 mb-4">Créez votre compte</h2>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Prénom" placeholder="Sophie" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} error={errors.firstName} leftIcon={<User className="w-4 h-4" />} />
                <Input label="Nom" placeholder="Martin" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              </div>
              <Input label="Email" type="email" placeholder="sophie@email.fr" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} leftIcon={<Mail className="w-4 h-4" />} />
              <Input label="Mot de passe" type={showPass ? 'text' : 'password'} placeholder="Minimum 8 caractères" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={<button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
              <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} error={errors.confirmPassword} leftIcon={<Lock className="w-4 h-4" />} />
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className="space-y-5 animate-slide-up">
              <h2 className="font-playfair text-xl font-bold text-gray-900">Votre événement</h2>
              {errors.eventType && <p className="text-red-500 text-sm">{errors.eventType}</p>}
              <div className="grid grid-cols-2 gap-3">
                {EVENT_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setForm(f => ({ ...f, eventType: type.value }))}
                    className={cn('p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-rose-300',
                      form.eventType === type.value ? 'border-rose-500 bg-rose-50' : 'border-gray-200'
                    )}
                  >
                    <span className="text-2xl block mb-1">{type.emoji}</span>
                    <p className="font-semibold text-sm text-gray-900">{type.label}</p>
                    <p className="text-xs text-gray-400">{type.desc}</p>
                  </button>
                ))}
              </div>
              <Input label="Nom de l'événement" placeholder="Mariage Sophie & Thomas" value={form.eventName}
                onChange={e => setForm(f => ({ ...f, eventName: e.target.value }))} error={errors.eventName} />
              <Input label="Date de l'événement" type="date" value={form.eventDate}
                onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} error={errors.eventDate} />
              <Input label="Lieu" placeholder="Château de Vaux-le-Vicomte" value={form.venue}
                onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} error={errors.venue} />
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="space-y-5 animate-slide-up">
              <h2 className="font-playfair text-xl font-bold text-gray-900">Derniers détails</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'invités estimé : <span className="text-rose-600 font-bold">{form.guestCount}</span>
                </label>
                <input
                  type="range" min={10} max={500} step={10} value={form.guestCount}
                  onChange={e => setForm(f => ({ ...f, guestCount: Number(e.target.value) }))}
                  className="w-full accent-rose-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10</span><span>150</span><span>300</span><span>500+</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment avez-vous entendu parler de nous ?</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300 appearance-none bg-white"
                  value={form.heardFrom} onChange={e => setForm(f => ({ ...f, heardFrom: e.target.value }))}>
                  <option value="">Choisissez...</option>
                  <option value="google">Recherche Google</option>
                  <option value="instagram">Instagram</option>
                  <option value="ami">Un ami / proche</option>
                  <option value="wedding">Salon du mariage</option>
                  <option value="blog">Blog mariage</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-rose-700 mb-2">Récapitulatif</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>👤 {form.firstName} {form.lastName}</li>
                  <li>📧 {form.email}</li>
                  <li>🎉 {form.eventName}</li>
                  <li>📅 {form.eventDate}</li>
                  <li>👥 ~{form.guestCount} invités</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div>
              {step > 0 && (
                <Button variant="ghost" leftIcon={<ChevronLeft className="w-4 h-4" />} onClick={prev}>Précédent</Button>
              )}
            </div>
            <div>
              {step < 2 ? (
                <Button rightIcon={<ChevronRight className="w-4 h-4" />} onClick={next}>Suivant</Button>
              ) : (
                <Button loading={loading} onClick={handleSubmit} size="lg">
                  Créer mon événement 🎉
                </Button>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="text-rose-500 hover:text-rose-600 font-semibold">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

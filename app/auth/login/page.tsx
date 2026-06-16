'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/hooks/useAuth'
import { useFacebookAuth } from '@/lib/hooks/useFacebookAuth'
import { ApiError } from '@/lib/api/client'

export default function LoginPage() {
  const router = useRouter()
  const { login, loginWithFacebook } = useAuth()
  const { loginWithFacebook: facebookSdkLogin } = useFacebookAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [facebookLoading, setFacebookLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const e: typeof errors = {}
    if (!email) e.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide'
    if (!password) e.password = 'Mot de passe requis'
    else if (password.length < 6) e.password = 'Au moins 6 caractères'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Connexion réussie !')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setFacebookLoading(true)
    try {
      const accessToken = await facebookSdkLogin()
      await loginWithFacebook(accessToken)
      toast.success('Connexion réussie !')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof ApiError || err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setFacebookLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-[#D4AF7A] flex items-center justify-center shadow-md">
                <span className="text-white font-playfair font-bold text-xl leading-none">f</span>
              </div>
              <span className="font-playfair font-bold text-2xl text-gray-900">faire<span className="text-gradient">part</span></span>
            </Link>
            <h1 className="font-playfair text-2xl font-bold text-gray-900">Bon retour !</h1>
            <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre espace organisateur</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="sophie@email.fr"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />
            <Input
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Masquer' : 'Afficher'}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <Link href="#" className="text-sm text-rose-500 hover:text-rose-600 font-medium">Mot de passe oublié ?</Link>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>Se connecter</Button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white text-gray-400 text-sm">ou</span></div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-sm text-gray-700"
              onClick={() => toast('Connexion Google bientôt disponible', { icon: '🔜' })}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuer avec Google
            </button>

            <button
              type="button"
              disabled={facebookLoading}
              className="w-full flex items-center justify-center gap-3 py-3 mt-3 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-sm text-gray-700 disabled:opacity-60"
              onClick={handleFacebookLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continuer avec Facebook
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-rose-500 hover:text-rose-600 font-semibold">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

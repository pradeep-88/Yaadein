import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/axiosInstances'
import { useAuth } from '../../contexts/AuthContext'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const vantaRef = useRef(null)
  const vantaEffectRef = useRef(null)

  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const threeMod = await import('three')
        // @ts-ignore
        window.THREE = threeMod
        await import('vanta/dist/vanta.birds.min')
        if (!mounted || !vantaRef.current || vantaEffectRef.current) return

        // @ts-ignore
        vantaEffectRef.current = window.VANTA.BIRDS({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0xf3f4f6,
          color1: 0x2563eb,
          color2: 0x1d4ed8,
          birdSize: 1.6,
          wingSpan: 22.0,
          separation: 50.0,
          alignment: 50.0,
          cohesion: 50.0,
          quantity: 3
        })
      } catch (e) {
        console.error('[Vanta] init failed', e)
      }
    })()

    return () => {
      mounted = false
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy()
        vantaEffectRef.current = null
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLoading) return
    setError('')
    setIsLoading(true)

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload =
        mode === 'login'
          ? { email, password }
          : { email, password, isAdmin }

      const res = await api.post(endpoint, payload)

      // Expect: { token, user: { _id / id, isAdmin } }
      const { token, user } = res.data || {}
      if (!token || !user) throw new Error('Bad auth response')

      const adminFlag = !!user.isAdmin
      const userId = String(user._id || user.id || '')

      if (!userId) throw new Error('Missing user id')

      // Persist
      localStorage.setItem('token', token)
      localStorage.setItem('isAdmin', String(adminFlag))
      localStorage.setItem('userId', userId)

      // Set header (defensive; your interceptor also reads localStorage)
      api.defaults.headers.common.Authorization = `Bearer ${token}`

      // Update context
      login({ token, isAdmin: adminFlag, userId })

      // Go
      navigate(adminFlag ? '/admin' : '/dashboard')
    } catch (err) {
      console.error('Auth error:', err)
      setError(err.response?.data?.error || err.message || 'Request failed')
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setPassword('')
    setIsAdmin(false)
  }

  return (
    <div ref={vantaRef} className="min-h-screen w-full flex items-center justify-center relative">
      {/* Overlay content in two columns */}
      <div className="absolute inset-0 z-10 flex">
        {/* Left Section - tagline */}
        <div className="w-1/2 flex flex-col items-center justify-center text-black /40 p-10 ">
          <h1 className="text-5xl font-extrabold tracking-tight
            bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent
            [background-size:200%_100%] animate-[shine_2.5s_linear_infinite]
            drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]">
            Your Private Cloud
          </h1>
          <p className="text-lg max-w-md text-center">
            Securely share and manage your images with full control.
            Experience seamless organization, instant access, and advanced security — all in one platform.
          </p>
        </div>

        {/* Right Section - login/signup */}
        <div className="w-1/2 flex items-center justify-center">
          {/* Animated gradient border */}
          <div className="p-[2px] rounded-2xl 
                          bg-[conic-gradient(at_20%_20%,#3b82f6,_#a855f7,_#ec4899,_#22d3ee,_#3b82f6)]
                          animate-[huerotate_8s_linear_infinite]">
            {/* Floating glass card */}
            <div className="w-full max-w-md rounded-xl bg-white/90 backdrop-blur-md shadow-xl
                            animate-[float_6s_ease-in-out_infinite]">
              {/* Tabs */}
              <div className="flex">
                <button
                  onClick={() => switchMode('login')}
                  className={`w-1/2 py-3 font-semibold ${
                    mode === 'login'
                      ? 'border-b-2 border-blue-600 text-blue-700 shadow-[0_2px_12px_rgba(59,130,246,0.25)]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => switchMode('signup')}
                  className={`w-1/2 py-3 font-semibold ${
                    mode === 'signup'
                      ? 'border-b-2 border-blue-600 text-blue-700 shadow-[0_2px_12px_rgba(59,130,246,0.25)]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8" aria-busy={isLoading}>
                <h2 className="text-2xl font-bold mb-6">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>

                {/* Email */}
                <div className="relative mb-4">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <path d="M3 8a9 9 0 1118 0 9 9 0 01-18 0z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 14c-3.314 0-6 1.343-6 3v2h12v-2c0-1.657-2.686-3-6-3z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 bg-white/80
                               focus:border-blue-500 focus:ring-4 focus:ring-blue-300/30 outline-none transition
                               disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Password */}
                <div className="relative mb-4">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 10V7a6 6 0 1112 0v3" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 10h14v10H5z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 bg-white/80
                               focus:border-blue-500 focus:ring-4 focus:ring-blue-300/30 outline-none transition
                               disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Admin toggle (signup only) */}
                {mode === 'signup' && (
                  <label className="flex items-center mb-4 select-none">
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={e => setIsAdmin(e.target.checked)}
                      disabled={isLoading}
                      className="mr-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    Register as Admin
                  </label>
                )}

                {/* CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full rounded-md py-2 px-4 font-semibold text-white
                             bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500
                             bg-[length:200%_100%] hover:animate-[btnshine_1.6s_linear_infinite]
                             shadow-lg shadow-indigo-300/30 transition active:scale-[0.99]
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" role="status" aria-label="loading">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"/>
                      </svg>
                      Processing…
                    </span>
                  ) : (
                    <>{mode === 'login' ? 'Login' : 'Sign Up'}</>
                  )}
                </button>

                {/* Error chip */}
                {error && (
                  <p className="mt-4 text-sm rounded-md bg-red-50 text-red-700 border border-red-200
                                px-3 py-2 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                    {error}
                  </p>
                )}

                {/* Switch helper */}
                <p className="mt-4 text-sm text-center text-gray-600">
                  {mode === 'login' ? (
                    <>Don’t have an account?{' '}
                      <button type="button" onClick={() => switchMode('signup')} className="text-blue-600 hover:underline" disabled={isLoading}>
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>Already have an account?{' '}
                      <button type="button" onClick={() => switchMode('login')} className="text-blue-600 hover:underline" disabled={isLoading}>
                        Login
                      </button>
                    </>
                  )}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../services/axiosInstances'
import { useAuth } from '../../contexts/AuthContext'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth() // ✅ fixed here

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/register', { email, password, isAdmin })

      login({ token: res.data.token, isAdmin: res.data.user.isAdmin }) // ✅ use login from context

      navigate(res.data.user.isAdmin ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
    }
  }

  return (
    <form onSubmit={handleSignup} className="p-8 max-w-md mx-auto">
      <h2 className="text-xl mb-4 font-semibold">Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="input"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="input mt-2"
      />

      <label className="block mt-4">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={e => setIsAdmin(e.target.checked)}
          className="mr-2"
        />
        Register as Admin
      </label>

      <button type="submit" className="btn mt-4">Sign Up</button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  )
}

export default Signup

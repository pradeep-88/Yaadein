// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from '../../services/axiosInstances'
// import { useAuth } from '../../contexts/AuthContext'

// const Login = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const navigate = useNavigate()
//   const { login } = useAuth()

// //   const handleLogin = async (e) => {
// //     e.preventDefault()
// //     try {
// //       const res = await axios.post('/auth/login', { email, password })

// //       // ✅ Update global auth context
// //       login({ token: res.data.token, isAdmin: res.data.user.isAdmin })

// //       // ✅ Navigate based on role
// //       navigate(res.data.user.isAdmin ? '/admin' : '/dashboard')
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Login failed')
// //     }
// //   }

// const handleLogin = async (e) => {
//   e.preventDefault()
//   try {
//     const res = await axios.post('/auth/login', { email, password })

//     const token = res.data.token
//     const isAdmin = res.data.user.isAdmin

//     // ✅ Safe fallback: store in localStorage
//     localStorage.setItem('token', token)
//     localStorage.setItem('isAdmin', isAdmin)

//     // ✅ Update context
//     login({ token, isAdmin })

//     // ✅ Navigate based on role
//     navigate(isAdmin ? '/admin' : '/dashboard')

//   } catch (err) {
//     setError(err.response?.data?.error || 'Login failed')
//   }
// }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleLogin} className="bg-white shadow-md p-8 rounded w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6">Login</h2>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           required
//           className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           required
//           className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
//         >
//           Login
//         </button>

//         {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
//       </form>
//     </div>
//   )
// }

// export default Login




import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../services/axiosInstances'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/login', { email, password })

      const { token, user } = res.data
      const { isAdmin, _id: userId } = user

      // ✅ Store in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('isAdmin', isAdmin)
      localStorage.setItem('userId', userId)

      // ✅ Update context
      login({ token, isAdmin, userId })

      // ✅ Navigate
      navigate(isAdmin ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white shadow-md p-8 rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Login
        </button>

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </form>
    </div>
  )
}

export default Login

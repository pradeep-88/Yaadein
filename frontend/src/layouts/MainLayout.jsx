import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const MainLayout = ({ children }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // prefer saved theme -> system -> light
    const saved = localStorage.getItem('theme')
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    const initial = saved ?? (systemDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen">
      {/* sticky nav; colors come from CSS variables in index.css */}
      <nav className="app-nav sticky top-0 z-50 px-6 py-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">📁 Yaadein</h1>

        <div className="flex items-center space-x-4 text-sm">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'underline font-semibold' : 'hover:underline'
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'underline font-semibold' : 'hover:underline'
            }
          >
            About
          </NavLink>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="rounded px-3 py-1 font-medium app-btn"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '🌙 Dark' : '🌞 light'}
          </button>

          <button
            onClick={handleLogout}
            className="rounded px-3 py-1 font-medium app-logout"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* main area inherits background/text via CSS variables */}
      <main className="app-main p-6">{children}</main>
    </div>
  )
}

export default MainLayout

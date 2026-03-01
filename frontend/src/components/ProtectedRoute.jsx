import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div className="p-4">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute

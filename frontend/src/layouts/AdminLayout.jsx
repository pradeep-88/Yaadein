import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const AdminLayout = ({ children }) => {
  const { logout } = useAuth()

  return (
    <div>
      <nav className="p-4 bg-black text-white flex justify-between">
        <h1>Admin Panel</h1>
        <button onClick={logout}>Logout</button>
      </nav>
      <main>{children}</main>
    </div>
  )
}

export default AdminLayout

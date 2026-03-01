import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import Signup from '../features/auth/Signup'
import NotFound from '../pages/NotFound'
import AdminDashboard from '../../src/features/admin/Admindashboard'
import Dashboard from '../features/dashboard/Dashboard'
import ProtectedRoute from '../features/auth/ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import FolderImagesPage from '../pages/FolderImagesPage'
import About from '../pages/About'
const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
<Route path="/folder/:id" element={<FolderImagesPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
            <Route path="/about" element={<About />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default AppRouter

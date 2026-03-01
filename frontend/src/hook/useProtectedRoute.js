import { useAuth } from '../contexts/AuthContext'

const useProtectedRoute = () => {
  const { token, isAdmin, isAuthenticated } = useAuth()
  return { isAdmin, isAuthenticated, token }
}

export default useProtectedRoute

import api from '../../services/axiosInstances'

export const loginUser = (email, password) => {
  return api.post('/auth/login', { email, password })
}

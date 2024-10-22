import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export function getUsername(): string | null {
  const username = localStorage.getItem('username')
  return username
}

export function getAuthToken(): string | null {
  const username = localStorage.getItem('token')
  return username
}

const useCheckToken = (): void => {
  const navigate = useNavigate()

  useEffect(() => {
    const token: string | null = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])
}

export default useCheckToken

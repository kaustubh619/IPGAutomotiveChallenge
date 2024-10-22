import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Logout: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')

    navigate('/login')
  }, [navigate])

  return null
}

export default Logout

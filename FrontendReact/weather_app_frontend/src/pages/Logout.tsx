import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Logout: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Remove token and username from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('username')

    // Redirect to the login page
    navigate('/login')
  }, [navigate])

  return null // Component does not render anything
}

export default Logout

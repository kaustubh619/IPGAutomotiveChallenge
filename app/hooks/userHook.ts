import { useEffect, useState } from 'react'

export const useUser = () => {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/get-username') // Call your new API endpoint
        if (response.ok) {
          const data = await response.json()
          setUsername(data.username)
        } else {
          console.error('Failed to fetch username')
        }
      } catch (error) {
        console.error('Error fetching username:', error)
      }
    }

    fetchUser()
  }, [])

  return { username }
}

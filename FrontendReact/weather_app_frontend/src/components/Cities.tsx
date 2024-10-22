import React, { useState, useEffect } from 'react'
import { Box, Alert, Snackbar } from '@mui/material'
import { useLoaderData } from 'react-router-dom'
import CitySelector from './CitySelector '
import Weather from './Weather'
import { getAuthToken } from '../utils/auth'

interface CityData {
  id: number
  city: string
}

// Function to fetch cities data
export const fetchCitiesData = async () => {
  const response = await fetch('http://localhost:8000/citis/', {
    method: 'GET',
    headers: {
      Authorization: 'token ' + getAuthToken(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch cities.')
  }

  const data = await response.json()
  return data.map((arg: { id: number; city: string }) => ({
    id: arg.id,
    city: arg.city,
  }))
}

// Loader function using defer
export const citiesLoader = () => {
  return {
    cities: fetchCitiesData(),
  }
}

const Cities: React.FC = () => {
  const loaderData = useLoaderData() as { cities: Promise<CityData[]> }
  const [cities, setCities] = useState<CityData[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
  const [hideChildComponents, setHideChildComponents] = useState<boolean>(false)

  // Fetch and resolve cities from the loader promise
  useEffect(() => {
    loaderData.cities.then(setCities).catch(() => {
      setError('Failed to load cities. Please come back later.')
      setShowSnackbar(true)
      setHideChildComponents(true)
    })
  }, [loaderData.cities])

  const handleDeleteCity = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to remove this city?')
    if (confirm) {
      try {
        const response = await fetch(`http://localhost:8000/city/${id}/`, {
          method: 'DELETE',
          headers: {
            Authorization: 'token ' + getAuthToken(),
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to delete the city. Please try again later.')
        }

        const updatedCities = await fetchCitiesData()
        setCities(updatedCities)
      } catch (err) {
        setError('Could not delete the city. Please try again later.')
        setShowSnackbar(true)
      }
    }
  }

  const handleCloseSnackbar = () => {
    setShowSnackbar(false)
    setError(null)
  }

  return (
    <>
      {error && (
        <Snackbar
          open={showSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={handleCloseSnackbar}>
            {error}
          </Alert>
        </Snackbar>
      )}
      {!hideChildComponents && (
        <CitySelector onCityAdded={() => fetchCitiesData().then(setCities)} />
      )}
      <Box
        className="weather-cards"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
      >
        {cities.map((city) => (
          <Weather
            key={city.id}
            city={city.city}
            onDelete={() => handleDeleteCity(city.id)}
          />
        ))}
      </Box>
    </>
  )
}

export default Cities

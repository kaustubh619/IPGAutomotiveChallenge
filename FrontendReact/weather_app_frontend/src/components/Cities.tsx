import React, { useState, Suspense } from 'react'
import {
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
} from '@mui/material'
import { useLoaderData, defer, Await } from 'react-router-dom'
import CitySelector from './CitySelector '
import Weather from './Weather'
import { getAuthToken } from '../utils/auth'

interface CityData {
  id: number
  city: string
}

// Function to fetch cities data
export const fetchCitiesData = async () => {
  const response = await fetch('http://localhost:8000/cities/', {
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
  return defer({
    cities: fetchCitiesData(),
  })
}

const Cities: React.FC = () => {
  const loaderData = useLoaderData() as { cities: Promise<CityData[]> }
  const [error, setError] = useState<string | null>(null)
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
  const [hideChildComponents, setHideChildComponents] = useState<boolean>(false)
  const [cities, setCities] = useState<CityData[] | null>(null)

  const handleCityAdded = async () => {
    try {
      const updatedCities = await fetchCitiesData()
      setCities(updatedCities)
    } catch (err) {
      setError('Could not update cities. Please try again later.')
      setShowSnackbar(true)
    }
  }

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

        await handleCityAdded()
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

      <Suspense
        fallback={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="50vh"
          >
            <CircularProgress />
            <Typography variant="h6" ml={2}>
              Loading cities, please wait...
            </Typography>
          </Box>
        }
      >
        <Await
          resolve={loaderData.cities}
          errorElement={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="50vh"
              textAlign="center"
            >
              <Alert severity="error" variant="filled">
                Failed to load cities. Please try again later.
              </Alert>
            </Box>
          }
        >
          {(resolvedCities: CityData[]) => {
            // Use cities from state if they are already set, otherwise use resolvedCities
            const displayCities = cities ?? resolvedCities
            return (
              <>
                {!hideChildComponents && (
                  <CitySelector onCityAdded={handleCityAdded} />
                )}
                <Box
                  className="weather-cards"
                  display="flex"
                  flexWrap="wrap"
                  justifyContent="center"
                >
                  {displayCities.map((city) => (
                    <Weather
                      key={city.id}
                      city={city.city}
                      onDelete={() => handleDeleteCity(city.id)}
                    />
                  ))}
                </Box>
              </>
            )
          }}
        </Await>
      </Suspense>
    </>
  )
}

export default Cities

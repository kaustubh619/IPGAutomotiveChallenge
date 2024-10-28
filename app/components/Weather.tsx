import React, { useState, useEffect } from 'react'
import { Box, Typography, CircularProgress, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Form } from '@remix-run/react'

interface WeatherData {
  temperature: number
  description: string
  city: string
  icon: string
  humidity: number
  precip_mm: number
}

const Weather: React.FC<{ city: string }> = (props) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const API_KEY = '02da5c75c95647ed903201308242110 '

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?q=${props.city}&key=${API_KEY}`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }

        const data = await response.json()

        setWeatherData({
          temperature: data.current.temp_c,
          description: data.current.condition.text,
          city: data.location.name,
          icon: data.current.condition.icon,
          humidity: data.current.humidity,
          precip_mm: data.current.precip_mm,
        })
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch weather data.')
        setLoading(false)
      }
    }

    fetchWeather()
  }, [API_KEY, props.city])

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
      m={5}
      sx={{
        bgcolor: '#242424',
        borderRadius: 2,
        boxShadow: 3,
        width: '300px',
        position: 'relative',
      }}
    >
      {weatherData && (
        <>
          <Form method="delete">
            <input type="hidden" name="city" value={weatherData.city} />
            <IconButton
              aria-label="delete"
              sx={{
                color: '#ff4d4d',
                position: 'absolute',
                top: 8,
                right: 8,
              }}
              type="submit"
            >
              <DeleteIcon />
            </IconButton>
          </Form>
          <Typography variant="h4">{weatherData.city}</Typography>
          <Typography variant="h6">{weatherData.temperature}°C</Typography>
          <Typography variant="h6">
            Humidity: {weatherData.humidity}%
          </Typography>
          <Typography variant="h6">
            Precipitation: {weatherData.precip_mm}mm
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mt={1}
            p={1}
            sx={{
              bgcolor: '#3B4B5A',
              borderRadius: 2,
              width: '100%',
            }}
          >
            <Typography
              variant="h6"
              sx={{ textTransform: 'capitalize', color: '#fff' }}
            >
              {weatherData.description}
            </Typography>
            <img
              src={weatherData.icon}
              alt={weatherData.description}
              style={{ width: '70px', height: '70px' }}
            />
          </Box>
        </>
      )}
    </Box>
  )
}

export default Weather

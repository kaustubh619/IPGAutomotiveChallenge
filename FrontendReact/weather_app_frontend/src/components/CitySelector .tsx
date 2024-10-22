import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  SelectChangeEvent,
} from '@mui/material'
import { cityNames } from '../utils/citiesList'
import { getAuthToken } from '../utils/auth'

interface CitySelectorProps {
  onCityAdded: () => void
}

const CitySelector: React.FC<CitySelectorProps> = ({ onCityAdded }) => {
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)

  const handleCityChange = (event: SelectChangeEvent<string>) => {
    setSelectedCity(event.target.value as string)
  }

  const handleAddCity = async () => {
    if (!selectedCity) {
      setError('Please select a city.')
      setShowSnackbar(true)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/cities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token ' + getAuthToken(),
        },
        body: JSON.stringify({ city: selectedCity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || 'Failed to add city.')
        setShowSnackbar(true)
        return
      }

      onCityAdded()

      setSelectedCity('')
      setError(null)
    } catch (err) {
      setError('Failed to add city. Please try again later.')
      setShowSnackbar(true)
    }
  }

  const handleCloseSnackbar = () => {
    setShowSnackbar(false)
    setError(null)
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2} mt={5}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textTransform: 'capitalize' }}
      >
        Add city to get weather details
      </Typography>

      <Select
        value={selectedCity}
        onChange={handleCityChange}
        displayEmpty
        sx={{
          width: 200,
          mb: 2,
          bgcolor: '#3B4B5A',
          color: '#ffffff',
          '.MuiSelect-select': { backgroundColor: '#3B4B5A' },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: '#3B4B5A',
              color: '#ffffff',
            },
          },
        }}
      >
        <MenuItem value="" disabled>
          Select a City
        </MenuItem>
        {cityNames.map((city, index) => (
          <MenuItem key={index} value={city}>
            {city}
          </MenuItem>
        ))}
      </Select>

      <Button variant="contained" color="primary" onClick={handleAddCity}>
        Add City
      </Button>

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
    </Box>
  )
}

export default CitySelector

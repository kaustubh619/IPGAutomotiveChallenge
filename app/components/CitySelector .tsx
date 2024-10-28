import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material'
import { cityNames } from '../utils/citiesList'
import { Form } from '@remix-run/react'
import { useActionData } from '@remix-run/react'

export default function CitySelector() {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)

  const actionData = useActionData()

  const handleCloseSnackbar = () => {
    setShowSnackbar(false)
  }

  useEffect(() => {
    if (actionData && actionData.error) {
      setShowSnackbar(true)
    }
  }, [actionData])

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2} mt={5}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textTransform: 'capitalize' }}
      >
        Add city to get weather details
      </Typography>

      <Form method="post" className="flex-box">
        <Select
          defaultValue=""
          displayEmpty
          name="city"
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

        <Button variant="contained" color="primary" type="submit">
          Add City
        </Button>
      </Form>

      {actionData && (
        <Snackbar
          open={showSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={handleCloseSnackbar}>
            {actionData.error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  )
}

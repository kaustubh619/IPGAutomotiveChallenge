import React from 'react'
import { Form, ActionFunction, useActionData, redirect } from 'react-router-dom'
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Alert,
} from '@mui/material'
import { useNavigation } from 'react-router-dom'

interface LoginActionData {
  error?: string
}

const Login: React.FC = () => {
  const actionData = useActionData() as LoginActionData | undefined

  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Full height of the viewport
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        bgcolor="#f5f5f5"
        p={4}
        borderRadius={2}
        boxShadow={3}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: '#333' }}
        >
          Login
        </Typography>

        {actionData && actionData.error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {actionData.error}
          </Alert>
        )}

        <Form method="post" style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            margin="normal"
            required
          />
          <Box mt={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Please wait...' : 'Login'}
            </Button>
          </Box>
        </Form>
      </Box>
    </Container>
  )
}

export default Login

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()

  const postData = {
    username: formData.get('username'),
    password: formData.get('password'),
  }

  try {
    // Send a request to the backend for authentication
    const response = await fetch('http://localhost:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
    console.log(response)
    if (response.ok) {
      const resData = await response.json()

      if (response.status === 200) {
        localStorage.setItem('token', resData.token)
        localStorage.setItem('username', resData.username)
        return redirect('/')
      }
    } else {
      const errorData = await response.json()
      return { error: errorData.non_field_errors }
    }
  } catch (e) {
    return { error: 'An error occurred. Please try again later.' }
  }
}

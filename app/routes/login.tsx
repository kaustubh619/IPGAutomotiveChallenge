import { Container, Box, Typography, TextField, Button } from '@mui/material'
import { Form } from '@remix-run/react'
import { login } from '~/data/auth.server'
import { ActionFunction, json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { redirect, type TypedResponse } from '@remix-run/node'

export default function Login() {
  const loginError = useActionData()

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
        {loginError && (
          <Typography
            variant="body1"
            sx={{
              color: 'error.main',
              marginTop: 1,
              fontWeight: 'bold',
            }}
          >
            {loginError.message}
          </Typography>
        )}
        <Form method="post" style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            variant="outlined"
            margin="normal"
            type="text"
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
            <Button type="submit" fullWidth variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </Form>
      </Box>
    </Container>
  )
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const username = formData.get('username') as string
  const password = formData.get('password') as string

  try {
    return await login({ username, password })
  } catch (error) {
    const typedError = error as { data?: string; status?: number }

    const message = typedError.data || 'An unexpected error occurred.'
    const status = typedError.status || 500

    return json({ message }, { status })
  }
}

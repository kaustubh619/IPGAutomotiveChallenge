import React from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import useCheckToken, { getUsername } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

const Navigation: React.FC = () => {
  useCheckToken()

  const username = getUsername()

  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/logout')
  }

  return (
    <AppBar position="static" sx={{ bgcolor: '#3B4B5A' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Welcome to the weather app&nbsp;{' '}
          <Typography
            component="span"
            sx={{
              fontWeight: 'bold',
              color: '#FFD700',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
            }}
          >
            {username}
          </Typography>
        </Typography>

        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation

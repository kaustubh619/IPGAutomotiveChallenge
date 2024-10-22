import React from 'react'
import Navigation from '../components/Navigation'
import { Outlet } from 'react-router-dom'

const RootLayout: React.FC = () => {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  )
}

export default RootLayout

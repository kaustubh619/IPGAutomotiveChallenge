import { Outlet } from '@remix-run/react'
import Navigation from '~/components/Navigation'

export default function ExpensesAppLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  )
}

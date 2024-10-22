import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login, { action as LoginAction } from './pages/Login'
import RootLayout from './pages/RootLayout'
import Logout from './pages/Logout'
import Cities, { citiesLoader as fetchCitiesLoader } from './components/Cities'

const router = createBrowserRouter([
  {
    path: '',
    element: <RootLayout />,
    children: [{ index: true, element: <Cities />, loader: fetchCitiesLoader }],
  },
  { path: 'login', element: <Login />, action: LoginAction },
  { path: 'logout', element: <Logout /> },
])

function App() {
  return <RouterProvider router={router} />
}

export default App

import { LoaderFunction, ActionFunction, json, redirect } from '@remix-run/node'
import { requireUserSession } from '~/data/auth.server'
import { useLoaderData } from '@remix-run/react'
import { Box } from '@mui/material'
import Weather from '~/components/Weather'
import CitySelector from '~/components/CitySelector '
import { addCity, getCitiesForUser, deleteCity } from '~/data/citites.server'

interface CityData {
  id: number
  city: string
}

export default function Index() {
  const loaderData = useLoaderData<CityData[]>()

  return (
    <>
      <CitySelector />
      <Box
        className="weather-cards"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
      >
        {loaderData.map((data) => (
          <Weather key={data.id} city={data.city} />
        ))}
      </Box>
    </>
  )
}

export const loader: LoaderFunction = async ({
  request,
}: {
  request: Request
}) => {
  const userId = await requireUserSession(request)

  try {
    return await getCitiesForUser(userId)
  } catch (error) {
    const message = 'Failed to load cities.'
    const status = 401

    return json({ message }, { status })
  }
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserSession(request)
  const formData = await request.formData()
  const city = formData.get('city') as string

  if (request.method === 'POST') {
    if (!city) {
      return json({ error: 'Please select a city.' }, { status: 400 })
    }

    try {
      await addCity({ userId, city })
      return redirect('/')
    } catch (err) {
      const typedError = err as { data?: string; status?: number }

      const error = typedError.data || 'An unexpected error occurred.'
      const status = typedError.status || 500

      return json({ error }, { status })
    }
  }

  if (request.method === 'DELETE') {
    const deletedCity = await deleteCity(city)
    return redirect('/')
  }
}

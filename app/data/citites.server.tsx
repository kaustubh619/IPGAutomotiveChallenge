import { prisma } from './database.server'

interface CityInput {
  userId: string
  city: string
}

class CustomError extends Error {
  data?: string
  status?: number

  constructor(data: string, status?: number) {
    super()
    this.data = data
    this.status = status
  }
}

export async function addCity({ userId, city }: CityInput) {
  // Check if the user already has 5 selected cities
  const existingCitiesCount = await prisma.selectedCity.count({
    where: { userId },
  })

  if (existingCitiesCount >= 5) {
    throw new CustomError('You cannot select more than 5 cities.', 401)
  }

  // Check if the city already exists for the user
  const cityExists = await prisma.selectedCity.findFirst({
    where: {
      userId,
      city,
    },
  })

  if (cityExists) {
    throw new CustomError('You have already selected this city.', 401)
  }
  const addedCity = await prisma.selectedCity.create({
    data: {
      userId,
      city,
    },
  })

  return addedCity
}

export async function getCitiesForUser(userId: string) {
  try {
    const cities = await prisma.selectedCity.findMany({
      where: { userId },
      select: {
        id: true,
        city: true,
      },
    })

    return cities
  } catch (error) {
    throw new Error('An error occurred while fetching cities for the user.')
  }
}

export async function deleteCity(city: string) {
  // Check if the city exists for the user
  const cityExists = await prisma.selectedCity.findFirst({
    where: {
      city,
    },
  })

  console.log('Entered Delete')

  if (!cityExists) {
    throw new CustomError('City not found in your selected list.', 404)
  }

  // Delete the city
  const deletedCity = await prisma.selectedCity.delete({
    where: {
      id: cityExists.id,
    },
  })

  return deletedCity
}

import { json, LoaderFunction } from '@remix-run/node'
import { getUserFromSession, getUserById } from '~/data/auth.server' // Adjust the path according to your project structure

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserFromSession(request)

  // Check if userId is null
  if (!userId) {
    return json({ username: null }, { status: 401 }) // Unauthorized status
  }

  const user = await getUserById(userId)
  if (!user) {
    return json({ username: null }, { status: 404 }) // Not found status
  }

  return json({ username: user.username }) // Return the username
}

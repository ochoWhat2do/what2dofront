// auth.ts

import { useEffect } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'

const otherHost = 'http://localhost:8080'
const bearer = 'Bearer '

// Define a custom hook for fetching user info
export function useFetchUserInfo() {
  const [cookies, setCookie] = useCookies([
    'authorization',
    'authorization_refresh',
    'user_info',
  ])

  async function fetchUserInfo() {
    const auth = cookies['authorization']

    if (!auth) {
      window.location.href = '/login'
      return
    }

    try {
      const response = await axios.get(`${otherHost}/api/users/info`, {
        headers: {
          Authorization: bearer + auth,
        },
      })
      const responseData = response.data

      if (!responseData.email) {
        window.location.href = '/login'
        return
      }

      const { email, admin } = responseData
      // Save data in cookies as JSON
      setCookie(
        'user_info',
        JSON.stringify({ email, role: admin ? 'ADMIN' : 'USER' }),
      )
    } catch (error) {
      // Handle error or logout if needed
    }
  }

  return fetchUserInfo
}

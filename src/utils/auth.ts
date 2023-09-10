import { useEffect } from 'react'
import axios from 'axios'
import { getCookie, setCookie } from '../utils/cookie'
import { useRouter } from 'next/router'

const indexHost = 'http://localhost:8080'
const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'
const bearer = 'Bearer '

// Define a custom hook for fetching user info
export function useFetchUserInfo() {
  const router = useRouter()

  async function fetchUserInfo() {
    const auth = getCookie('authorization')
    if (!auth) {
      router.push('/login')
      return
    }

    try {
      const response = await axios.get(`${apiBaseUrl}/api/users/info`, {
        headers: {
          Authorization: bearer + auth,
        },
      })
      const responseData = response.data

      if (!responseData.email) {
        router.push('/login')
        return
      }

      const { userId, email, admin, picture, nickname } = responseData

      // Save data in cookies as JSON
      setCookie(
        'user_info',
        JSON.stringify({
          userId: userId || 0,
          email,
          role: admin ? 'ADMIN' : 'USER',
          picture: picture || '', // Use picture if available, otherwise empty string
          nickname: nickname,
        }),
      )
    } catch (error) {
      setCookie('authorization', '', { expires: new Date(0) })
      router.push('/login')
    }
  }

  return fetchUserInfo
}

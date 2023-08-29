import React, { useEffect } from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useFetchUserInfo } from '../utils/auth' // Import useFetchUserInfo from auth.ts

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const fetchUserInfo = useFetchUserInfo()

  useEffect(() => {
    const handleRouteChange = async () => {
      if (router.pathname !== '/login' && router.pathname !== '/signup') {
        await fetchUserInfo() // Call the fetchUserInfo function
      }
    }

    // Initial call when the app loads
    handleRouteChange()

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [fetchUserInfo, router])

  return <Component {...pageProps} />
}

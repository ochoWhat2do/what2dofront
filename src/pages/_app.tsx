// _app.tsx 파일
import React, { useEffect } from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useFetchUserInfo } from '../utils/auth' // Import useFetchUserInfo from auth.ts
import { CookiesProvider } from 'react-cookie'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const fetchUserInfo = useFetchUserInfo()

  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      if (url !== '/login' && url !== '/signup') {
        await fetchUserInfo() // Call the fetchUserInfo function
      }
    }

    // Initial call when the app loads
    handleRouteChange(router.pathname)

    const routeChangeHandler = (url: string) => {
      handleRouteChange(url)
    }

    router.events.on('routeChangeComplete', routeChangeHandler)

    return () => {
      router.events.off('routeChangeComplete', routeChangeHandler)
    }
  }, []) // An empty dependency array ensures the effect runs only once on mount

  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  )
}

// _app.tsx 파일
import React, { useEffect } from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { CookiesProvider } from 'react-cookie'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  // const fetchUserInfo = useFetchUserInfo()

  useEffect(() => {
    // const fetchData = async () => {
    //   await fetchUserInfo()
    // }
    // debugger
    // fetchData() // Call the fetchUserInfo function
    // const routeChangeHandler = (url: string) => {
    //   fetchData() // Call the fetchUserInfo function
    // }
    // router.events.on('routeChangeComplete', routeChangeHandler)
    // return () => {
    //   router.events.off('routeChangeComplete', routeChangeHandler)
    // }
  }, []) // An empty dependency array ensures the effect runs only once on mount

  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  )
}

// _app.tsx 파일
import React, { useEffect } from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { CookiesProvider } from 'react-cookie'
import axios from 'axios'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL

  useEffect(() => {}, []) // An empty dependency array ensures the effect runs only once on mount

  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  )
}

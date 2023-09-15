import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getCookie, removeCookie } from '../../utils/cookie'
import styles from './Header.module.css'
import { useFetchUserInfo } from '../../utils/auth' // Import useFetchUserInfo from auth.ts

interface UserInfo {
  picture: string
  email: string
  nickname: string
}

const Header = () => {
  const router = useRouter()
  const [userPicture, setUserPicture] = useState<string>('') // State to hold user picture
  const [isDataFetched, setIsDataFetched] = useState(false)
  const fetchUserInfo = useFetchUserInfo()

  const fetchUserInfoAndRender = async () => {
    await fetchUserInfo()

    const user_info = getCookie('user_info')
    if (user_info && user_info.picture) {
      setUserPicture(user_info.picture)
    }

    setIsDataFetched(true)
  }

  const handleLogout = () => {
    removeCookie('authorization')
    removeCookie('user_info')
    router.push('/login')
  }
  const handleMyPage = () => {
    router.push('/users/myPage')
  }

  const handleMainPage = () => {
    const authCookie = getCookie('authorization')

    if (!authCookie) {
      // If authorization cookie is not present, redirect to login
      router.push('/login')
      return
    } else {
      router.push('/')
    }
  }

  const isAuthenticated = !!getCookie('authorization') // Convert to boolean
  const [isClientSideRendered, setIsClientSideRendered] = useState(false)
  useEffect(() => {
    if (router.pathname !== '/signup' && router.pathname !== '/login') {
      // Skip fetching user info on signup page
      fetchUserInfoAndRender()
    } else {
      setIsDataFetched(true)
    }
    const user_info = getCookie('user_info')
    if (user_info && user_info.picture) {
      setUserPicture(user_info.picture)
    }
    setIsClientSideRendered(true)
  }, [])

  const authenticatedContent = isAuthenticated && isClientSideRendered && (
    <li className={styles.navItem}>
      <Link href="/profile">
        <img
          src={userPicture || '/images/ic-person.png'} // Use the state value here
          alt="프로필 이미지"
        />
      </Link>
    </li>
  )

  const authButtons = isAuthenticated ? (
    <li className={styles.navItem}>
      <button onClick={handleLogout}>로그아웃</button>
    </li>
  ) : (
    <li className={styles.navItem}>
      <Link href="/login">로그인</Link>
    </li>
  )

  const myPageButtons = isAuthenticated && (
    <li className={styles.navItem}>
      <button onClick={handleMyPage}>마이페이지</button>
    </li>
  )
  const signupLink = !isAuthenticated && (
    <li className={styles.navItem}>
      <Link href="/signup">회원가입</Link>
    </li>
  )

  const mainLink = (
    <div className={styles.mainImg} onClick={handleMainPage}>
      <img src="/images/what2do_logo.png" alt="로고 이미지" width="80" />
    </div>
  )

  return (
    <header className={styles.header}>
      <div className={styles.logo}>{mainLink}</div>
      <nav className={styles.nav}>
        <ul>
          {isClientSideRendered && (
            <>
              {myPageButtons}
              {authenticatedContent}
              {authButtons}
              {signupLink}
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header

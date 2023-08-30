import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCookie, setCookie, removeCookie } from '../../utils/cookie'
import styles from './Header.module.css'
import { useRouter } from 'next/router'
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

  const isAuthenticated = !!getCookie('authorization') // Convert to boolean
  const [isClientSideRendered, setIsClientSideRendered] = useState(false)
  useEffect(() => {
    fetchUserInfoAndRender()
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

  const signupLink = !isAuthenticated && (
    <li className={styles.navItem}>
      <Link href="/signup">회원가입</Link>
    </li>
  )

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/images/what2do_logo.png" alt="로고 이미지" width="120" />
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          {isClientSideRendered && (
            <>
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

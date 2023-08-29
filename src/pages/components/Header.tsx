import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCookies } from 'react-cookie' // Import useCookies
import styles from './Header.module.css'
import { useRouter } from 'next/router'

interface UserInfo {
  picture: string
  email: string
  nickname: string
}

const Header = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    'authorization',
    'user_info',
  ])
  const router = useRouter()

  const handleLogout = () => {
    removeCookie('authorization')
    router.push('/')
  }

  const isAuthenticated = !!cookies.authorization // Convert to boolean
  const [isClientSideRendered, setIsClientSideRendered] = useState(false)
  useEffect(() => {
    setIsClientSideRendered(true)
  }, [])

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
              {isAuthenticated && (
                <li className={styles.navItem}>
                  <Link href="/profile">
                    <img
                      src={
                        cookies.user_info && cookies.user_info.picture
                          ? cookies.user_info.picture
                          : '/images/ic-person.png'
                      }
                      alt="프로필 이미지"
                    />
                  </Link>
                </li>
              )}
              {isAuthenticated ? (
                <li className={styles.navItem}>
                  <button onClick={handleLogout}>로그아웃</button>
                </li>
              ) : (
                <li className={styles.navItem}>
                  <Link href="/login">로그인</Link>
                </li>
              )}
              {!isAuthenticated && (
                <li className={styles.navItem}>
                  <Link href="/signup">회원가입</Link>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header

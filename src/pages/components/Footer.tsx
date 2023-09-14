import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from './Footer.module.css'

const Footer = () => {
  const router = useRouter()

  const handlePolicy = () => {
    router.push('/info/policy')
  }

  const handlePrivacy = () => {
    router.push('/info/privacy')
  }

  const policyButtons = (
    <li className={styles.navItem}>
      <button onClick={handlePolicy}>서비스 약관</button>
    </li>
  )
  const privacyButtons = (
    <li className={styles.navItem}>
      <button onClick={handlePrivacy}>개인정보처리방침</button>
    </li>
  )

  return (
    <div>
      <footer className={styles.footer}>
        <div className={styles.footerlogo}>
          <Link href="/">
            <img src="/images/what2do_logo.png" alt="로고 이미지" width="45" />
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul>
            <>
              {privacyButtons}
              {policyButtons}
            </>
          </ul>
        </nav>
        <div className={styles.companyInfo}>
          © 2023 Ocho Co., Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Footer

import React from "react";
import Link from "next/link";
import styles from "./Header.module.css"; // 스타일링을 위한 CSS 모듈

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/images/what2do_logo.png" alt="로고 이미지" width="120" />
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li className={styles.navItem}>
            <Link href="/login">로그인</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/signup">회원가입</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

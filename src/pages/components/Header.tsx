import React from "react";
import Link from "next/link";
import { useCookies } from "react-cookie"; // Import useCookies
import styles from "./Header.module.css";
import { useRouter } from "next/router";

const Header = () => {
  const [cookies, , removeCookie] = useCookies(["authorization"]); // Use cookies and removeCookie
  const router = useRouter();

  const handleLogout = () => {
    // Remove "authorization" cookie
    removeCookie("authorization");
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <img src="/images/what2do_logo.png" alt="로고 이미지" width="120" />
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          {cookies.authorization ? ( // Check if "authorization" cookie exists
            <li className={styles.navItem}>
              <button onClick={handleLogout}>로그아웃</button>
            </li>
          ) : (
            <li className={styles.navItem}>
              <Link href="/login">로그인</Link>
            </li>
          )}
          {!cookies.authorization && ( // Show signup link when not logged in
            <li className={styles.navItem}>
              <Link href="/signup">회원가입</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

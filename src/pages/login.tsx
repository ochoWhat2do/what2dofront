import { useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import { setCookie } from '../utils/cookie'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css' // Import login.module.css

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  //backend 주소
  const indexHost = 'http://localhost:8080' // 로컬
  const devHost = 'http://localhost:8080' // 개발

  const handleLogin = async () => {
    try {
      const response = await axios.post(devHost + '/api/users/login', {
        email,
        password,
      })

      if (response.status === 200) {
        setMessage('로그인이 성공적으로 완료되었습니다.')
        // Save tokens in cookies
        setCookie('authorization', response.headers['authorization'], {
          path: '/',
          secure: true,
          sameSite: 'none',
        })
        setCookie(
          'authorization_refresh',
          response.headers['authorization_refresh'],
          {
            path: '/',
            secure: true,
            sameSite: 'none',
          },
        )

        router.push('/')
      }
    } catch (error) {
      setMessage('로그인 중 오류가 발생했습니다.')
    }
  }

  return (
    <div>
      <Header />
      <div className={styles['login-form']}>
        {' '}
        {/* Use styles["class-name"] */}
        <div className={styles['login-title']}>오늘 뭐하지? 로그인</div>
        <div className={styles['login-input-container']}>
          <div className="login-id-label">이메일</div>
          <input
            type="email"
            name="email"
            id="email"
            className={styles['login-input-box']}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles['login-input-container']}>
          <div className="login-id-label">비밀번호</div>
          <input
            type="password"
            name="password"
            id="password"
            className={styles['login-input-box']}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles['login-id-submit']} onClick={handleLogin}>
          로그인
        </button>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Login

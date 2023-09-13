import { useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import Footer from './components/Footer'
import { setCookie } from '../utils/cookie'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css' // Import login.module.css
import { KAKAO } from '../variables/common'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  // backend 주소
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080' // 개발

  // 카카오 로그인 시작
  const handleKakaoLogin = async () => {
    try {
      // 카카오 로그인 페이지로 리다이렉트
      const client_id = KAKAO.CLIENT_ID
      const redirect_uri =
        process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL ||
        'https://www.what2do.co.kr/oauth/kakao' // 개발
      window.location.href = `${KAKAO.LOGIN_URL}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`
    } catch (error) {
      setMessage('로그인 중 오류가 발생했습니다.')
    }
  }

  const handleLogin = async () => {
    console.log(apiBaseUrl)
    try {
      const response = await axios.post(apiBaseUrl + '/api/users/login', {
        email,
        password,
      })

      if (response.status === 200) {
        window.alert('로그인에 성공하였습니다.')
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
    } catch (error: any) {
      window.alert('로그인에 실패하였습니다. 다시 시도해주세요.')
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
        <div className={styles['social-login']}>
          <button onClick={handleKakaoLogin}>
            <img
              className={styles['kakao-logo']}
              src="/images/kakao-logo.png"
              alt="Kakao"
            />{' '}
            Kakao 로그인
          </button>
        </div>
        {/* <a className="btn btn-block social-btn google" href="#">
          <img
            className="google-logo"
            src="/images/google-logo.png"
            alt="Google"
          />{' '}
          Sign in with Google
        </a> */}
        {/* <a className="btn btn-block social-btn naver" href="#">
          <img
            className="naver-logo"
            src="/images/naver-logo.png"
            alt="Naver"
          />{' '}
          Sign in with Naver
        </a> */}
      </div>
      <Footer />
    </div>
  )
}

export default Login

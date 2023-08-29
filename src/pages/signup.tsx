import { useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import styles from '../styles/signup.module.css'
import { useRouter } from 'next/router'

const Signup = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirm, setPasswordConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [isAdmin, setIsAdmin] = useState(false) // State for admin checkbox
  const [adminToken, setAdminToken] = useState('') // State for admin token input
  const [nickname, setNickname] = useState('') // State for nickname input
  const [city, setCity] = useState('') // State for city input
  const [gender, setGender] = useState('') // State for gender select
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  const handleEmailBlur = async () => {
    if (!validateEmail(email)) {
      window.alert('유효한 이메일 형식이 아닙니다.')
      return
    }

    try {
      debugger
      const response = await axios.get(
        `http://localhost:8080/api/users/checkEmail?email=${email}`,
      )

      if (response.data) {
        window.alert('이미 등록된 이메일입니다.')
        setEmail('') // Clear email input
      }
    } catch (error) {
      console.error('이메일 중복 체크 오류:', error)
    }
  }

  const handleSignup = async () => {
    // Check if password and password_confirm match
    if (password !== password_confirm) {
      setPasswordMismatch(true)
      window.alert('비밀번호와 비밀번호 확인의 내용이 다릅니다.')
      return // Stop the signup process
    }

    // Email validation
    if (!validateEmail(email)) {
      window.alert('유효한 이메일 형식이 아닙니다.')
      return
    }

    // password validation
    if (!password || !validatePassword(password)) {
      window.alert(
        '숫자,소문자,특수문자를 각각 1자씩 포함한 8자 이상으로 비밀번호를 구성해야 합니다.',
      )
      return
    }

    // Nickname and password validation
    if (!nickname) {
      window.alert('닉네임은 필수 입력 항목입니다.')
      return
    }

    // Admin token validation
    if (isAdmin && !adminToken) {
      window.alert('사장님(판매자)인 경우 사장님 키를 입력해주세요.')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/users/signup',
        {
          email,
          password,
          nickname,
          city,
          gender,
          admin: isAdmin, // Pass the admin state value
          adminToken,
        },
      )

      if (response.status === 200) {
        setMessage('회원가입이 성공적으로 완료되었습니다.')
        router.push('/login')
      }
    } catch (error) {
      setMessage('회원가입 중 오류가 발생했습니다.')
    }
  }

  const handleAdminCheckbox = () => {
    setIsAdmin(!isAdmin)
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    const isValid = passwordRegex.test(password)
    return isValid
  }

  return (
    <div>
      <Header /> {/* Render the Header component here */}
      <div className={styles['signup-form']}>
        <div className={styles['signup-title']}>회원가입</div>
        <div className={styles['signup-input-container']}>
          <div className="signup-id-label">이메일</div>
          <input
            type="email"
            name="email"
            id="email"
            className={styles['signup-input-box']}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur} // Call email validation on blur
          />
        </div>
        <div className={styles['signup-input-container']}>
          <div className="signup-id-label">비밀번호</div>
          <input
            type="password"
            name="password"
            id="password"
            className={styles['signup-input-box']}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles['signup-input-container']}>
          <div className="signup-id-label">비밀번호확인</div>
          <input
            type="password"
            name="password_confirm"
            id="password_confirm"
            className={styles['signup-input-box']}
            value={password_confirm}
            onBlur={() => {
              if (password !== password_confirm) {
                setPasswordMismatch(true)
              } else {
                setPasswordMismatch(false)
              }
            }}
            onChange={(e) => {
              setPasswordConfirm(e.target.value)
            }}
          />
          {passwordMismatch && (
            <p style={{ color: 'red' }}>
              비밀번호와 비밀번호 확인의 내용이 다릅니다.
            </p>
          )}
        </div>
        <div className={styles['signup-input-container']}>
          <div className="signup-id-label">닉네임</div>
          <input
            type="text"
            name="nickname"
            id="nickname"
            className={styles['signup-input-box']}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className={styles['signup-input-container']}>
          <div className="signup-id-label">도시</div>
          <input
            type="text"
            name="city"
            id="city"
            className={styles['signup-input-box']}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className={styles['signup-input-container']}>
          <div className="signup-id-label">성별</div>
          <select
            name="gender"
            id="gender"
            className={styles['signup-input-box']}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">선택하세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              id="admin-check"
              name="admin"
              onChange={handleAdminCheckbox}
              style={{ marginTop: '40px' }}
            />
            사장님(판매자)
          </label>
          {isAdmin && (
            <input
              type="password"
              id="admin-token"
              name="adminToken"
              placeholder="사장님 키"
              className={styles['signup-input-box']}
            />
          )}
        </div>
        <button className={styles['signup-id-submit']} onClick={handleSignup}>
          회원가입
        </button>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Signup

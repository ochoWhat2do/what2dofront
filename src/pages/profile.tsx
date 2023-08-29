import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'
import styles from '../styles/profile.module.css' // Import profile.module.css

const Profile = () => {
  const otherHost = 'http://localhost:8080'
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [picture, setPicture] = useState('')
  const [nickname, setNickName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [selectedPicture, setselectedPicture] = useState<null | File>(
    null as File | null,
  )
  const [cookies, setCookie] = useCookies([
    'authorization',
    'authorization_refresh',
    'user_info',
  ])

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      const response = await axios.get(otherHost + '/api/users/profile')
      setPicture(response.data.imageUrl)
      setIntroduction(response.data.introduction)
      setNickName(response.data.nickname)
      setEmail(response.data.email)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = function (event) {
        if (event.target && event.target.result) {
          setPicture(event.target.result.toString()) // Convert ArrayBuffer to string
        }
      }
      reader.readAsDataURL(e.target.files[0])
      setselectedPicture(e.target.files[0])
    }
  }

  const editProfile = async () => {
    try {
      const formData = new FormData()
      formData.append('introduction', introduction)
      formData.append('password', password)
      if (selectedPicture) {
        formData.append('profilePic', selectedPicture)
      }
      const response = await axios.put(
        otherHost + '/api/users/info',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      setMessage(response.data.msg)
      router.reload()
    } catch (error: any) {
      // 이 부분에서 error 변수의 형식을 any로 지정
      setMessage(error.response.data.msg)
    }
  }

  return (
    <div>
      <Header /> {/* Render the Header component here */}
      <div className={styles['profile-form']}>
        {' '}
        {/* Use styles["class-name"] */}
        <div className={styles['profile-title']}>프로필 정보</div>
        <div className={styles['profile-input-container']}>
          <div className="profile-id-label">이메일</div>
          <input
            type="email"
            name="email"
            id="email"
            className={styles['profile-input-box']}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles['profile-input-container']}>
          <div className="profile-id-label">닉네임</div>
          <input
            type="text"
            name="nickname"
            id="nickname"
            className={styles['profile-input-box']}
            value={nickname}
            onChange={(e) => setNickName(e.target.value)}
          />
        </div>
        <div className={styles['profile-input-container']}>
          <div className="profile-id-label">비밀번호</div>
          <input
            type="password"
            name="password"
            id="password"
            className={styles['profile-input-box']}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles['profile-input-container']}>
          <div className="profile-id-label">프로필 사진</div>
          <img
            src={picture}
            alt="프로필 사진"
            className={`${styles['profile-image']} ${styles['rounded']}`}
          />
          <input
            type="file"
            id="profile-pic"
            name="profilePic"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button className={styles['profile-id-submit']} onClick={editProfile}>
          수정
        </button>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Profile

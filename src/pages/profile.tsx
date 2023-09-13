import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import Footer from './components/Footer'
import { getCookie, setCookie } from '../utils/cookie'
import { useRouter } from 'next/router'
import styles from '../styles/profile.module.css' // Import profile.module.css

const Profile = () => {
  // backend 주소
  const indexHost = 'http://localhost:8080' // 로컬
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080' // 개발

  const router = useRouter()
  const auth = getCookie('authorization')
  const [email, setEmail] = useState('')
  const [picture, setPicture] = useState('')
  const [nickname, setNickName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [selectedPicture, setselectedPicture] = useState<null | File>(
    null as File | null,
  )

  const bearer = 'Bearer '

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/users/profile`, {
        headers: {
          Authorization: bearer + auth,
        },
      })

      setPicture(response.data.picture)
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

  const handleEditProfile = () => {
    const shouldEdit = window.confirm('프로필을 수정하시겠습니까?')
    if (shouldEdit) {
      editProfile()
    }
  }

  const handleDeleteAccount = () => {
    const shouldDelete = window.confirm('회원을 탈퇴하시겠습니까?')
    if (shouldDelete) {
      deleteAccount()
    }
  }

  const editProfile = async () => {
    try {
      const formData = new FormData()
      if (selectedPicture) {
        formData.append('profilePic', selectedPicture)
      }

      const jsonBody = {
        email: email,
        introduction: introduction,
        password: password,
        nickname: nickname,
      }

      formData.append(
        'requestDto',
        new Blob([JSON.stringify(jsonBody)], {
          type: 'application/json',
        }),
      )

      const response = await axios.put(
        apiBaseUrl + '/api/users/info',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth}`,
          },
        },
      )

      window.alert('프로필을 수정하였습니다.')
      router.push('/')
    } catch (error: any) {
      window.alert(error.response.data.statusMessage)
      return
    }
  }

  const deleteAccount = async () => {
    if (!password) {
      window.alert('비밀번호를 입력하세요.')
      return
    }

    try {
      const withdrawalData = {
        password: password, // Add the password value
      }

      await axios.delete(`${apiBaseUrl}/api/users/info`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
        data: withdrawalData,
      })
      window.alert('회원탈퇴를 하였습니다.')
      router.push('/login')
    } catch (error: any) {
      window.alert(error.response.data.statusMessage)
    }
  }

  return (
    <div>
      <Header />
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
            readOnly
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
          <div className="profile-id-label">자기소개</div>
          <input
            type="text"
            name="introduction"
            id="introduction"
            className={styles['profile-input-box']}
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
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
          <div className={styles['profile-image-container']}>
            <img
              src={picture || '/images/ic-person.png'}
              alt="프로필 사진"
              className={`${styles['profile-image']} ${styles.rounded}`}
            />
          </div>
          <input
            type="file"
            id="profile-pic"
            name="profilePic"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className={styles['profile-input-container']}>
          <button
            className={styles['profile-id-submit']}
            onClick={handleEditProfile}
          >
            수정
          </button>
          <button
            className={styles['profile-id-delete']}
            onClick={handleDeleteAccount}
          >
            회원 탈퇴
          </button>
        </div>
        <p>{message}</p>
      </div>
      <Footer />
    </div>
  )
}

export default Profile

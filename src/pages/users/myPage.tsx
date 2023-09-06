import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import { getCookie, setCookie } from '../../utils/cookie'
import { useRouter } from 'next/router'
import styles from '../../styles/myPage.module.css' // Import myPage.module.css

interface Store {
  id: number
  title: string
  homePageLink: string
  category: string
  address: string
  roadAddress: string
  latitude: string
  longitude: string
  picture: string
  storeKey: string
}

interface Review {
  id: number
  title: string
  content: string
  createdAt: Date
  likeCount: number
  attachment: S3FileDto[]
}

interface S3FileDto {
  originalFileName: string
  uploadFileName: string
  uploadFilePath: string
  uploadFileUrl: string
}

const MyPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const { storeKey } = router.query // 쿼리 파라미터 가져오기
  const [storeFavorite, setStoreFavorite] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const { storeId, reviewId } = router.query // 쿼리 파라미터 가져오기
  //backend 주소
  const indexHost = 'http://localhost:8080' // 로컬
  const devHost = 'http://localhost:8080' // 개발 const auth = getCookie('authorization')
  const auth = getCookie('authorization')
  const bearer = 'Bearer '
  const [storeList, setStoreList] = useState<Store[]>([])
  const [storeStoreKey, setStoreKey] = useState('')
  const [reviewList, setReviewList] = useState<Review[]>([])

  const user_info = getCookie('user_info')

  useEffect(() => {
    getReiviews()
    getMyStores()
  }, [])

  const getReiviews = async () => {
    try {
      console.log(user_info)
      const response = await axios.get(
        `${devHost}/api/users/${user_info.userId}/reviews`,
        {
          params: {
            page: 1,
            size: 10,
            sortBy: 'createdAt',
            isAsc: false,
          },
          headers: {
            Authorization: bearer + auth,
          },
        },
      )
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching 리뷰:', error)
    }
  }

  const getMyStores = async () => {
    try {
      console.log(user_info)
      const response = await axios.get(`${devHost}/api/stores/storefavorites`, {
        params: {
          storeKey: storeKey,
        },
        headers: {
          Authorization: bearer + auth,
        },
      })
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching 가게 목록:', error)
    }
  }

  // useEffect(() => {
  //   // Check if storeModel has a value before calling getReviews
  //   if (reviewModel) {
  //     getComments()
  //   }
  // }, [reviewModel])

  //   // Axios 또는 다른 방법을 사용하여 사용자 리뷰 데이터 가져오기
  //   const response = await axios
  //     .getReiviews('${devHost}/api/users/{userId}/reviews', {
  //       headers: {
  //         Authorization: bearer + auth,
  //       },
  //     })
  //     .then((response) => {
  //       setUserReviews(response.data)
  //     })
  //     .catch((error) => {
  //       console.error('나의 리뷰 가져오기 실패:', error)
  //     })
  // }, [])

  //     const handleMyPage = async () => {
  //       try {
  //         const response = await axios.post(devHost + '/api/users/myPage', {
  //           email,
  //           password,
  //         })

  //         if (response.status === 200) {
  //           window.alert('로그인에 성공하였습니다.')
  //           // Save tokens in cookies
  //           setCookie('authorization', response.headers['authorization'], {
  //             path: '/',
  //             secure: true,
  //             sameSite: 'none',
  //           })
  //           setCookie(
  //             'authorization_refresh',
  //             response.headers['authorization_refresh'],
  //             {
  //               path: '/',
  //               secure: true,
  //               sameSite: 'none',
  //             },
  //           )

  //           router.push('/')
  //         }
  //       } catch (error: any) {
  //         window.alert('로그인에 실패하였습니다. 다시 시도해주세요.')
  //       }
  //     }

  return (
    <div>
      <Header />
      <div className={styles['MyPage-form']}>
        {' '}
        <h2>마이페이지</h2>
        <div className=""></div>
      </div>
    </div>
  )
}

export default MyPage

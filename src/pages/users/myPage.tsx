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
  createEmail: string
  storeId: number
  rate: number
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
  const { storeId, reviewId } = router.query // 쿼리 파라미터 가져오기
  // backend 주소
  const indexHost = 'http://localhost:8080' // 로컬
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080' // 개발 const auth = getCookie('authorization')
  const auth = getCookie('authorization')
  const bearer = 'Bearer '
  const [storeList, setStoreList] = useState<Store[]>([])
  const [storeStoreKey, setStoreKey] = useState('')
  const [reviewList, setReviewList] = useState<Review[]>([])
  const [myStores, setMyStores] = useState([])

  const user_info = getCookie('user_info')

  useEffect(() => {
    getReiviews()
    getMyStores()
  }, [])

  const getReiviews = async () => {
    try {
      console.log(user_info)
      const response = await axios.get(
        `${apiBaseUrl}/api/users/${user_info.userId}/reviews`,
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
      const reviewList = response.data

      // Update the state with the reviewElements
      setReviewList(reviewList)
    } catch (error) {
      console.error('Error fetching 리뷰:', error)
    }
  }

  const getMyStores = async () => {
    try {
      console.log(user_info)
      const response = await axios.get(
        `${apiBaseUrl}/api/stores/storefavorites`,
        {
          params: {
            storeKey: storeKey,
          },
          headers: {
            Authorization: bearer + auth,
          },
        },
      )
      console.log(response.data)
      setStoreList(response.data.storeFavoriteList) // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching 가게 목록:', error)
    }
  }

  const handleReviewClick = (
    e: React.MouseEvent,
    reviewId: number,
    storeId: number,
  ) => {
    e.preventDefault() // 기본 이벤트(링크 이동) 방지
    const reviewIdStr = reviewId.toString()
    const storeIdStr = storeId.toString()
    // 페이지 이동 및 데이터 전달
    router.push({
      pathname: '/review/reviewDetail',
      query: { storeId: storeIdStr, reviewId: reviewIdStr },
    })
  }

  const handleStoreClick = (e: React.MouseEvent, storeKey: string) => {
    e.preventDefault() // 기본 이벤트(링크 이동) 방지
    const store = storeKey.toString()
    // 페이지 이동 및 데이터 전달
    router.push({
      pathname: '/store/storeView',
      query: { storeKey: store },
    })
  }

  return (
    <div>
      <Header />
      <div className={styles['MyPage-form']}>
        {' '}
        <h2 className={styles.h2}>마이페이지</h2>
        <div className={styles.container}>
          <div className={styles.nameBox}>
            <h1>나의 리뷰</h1>
          </div>
          <ul>
            <div className={styles.reviewContainer}>
              {reviewList.map((review) => (
                <div
                  key={review.id}
                  className={styles.reviewItem}
                  onClick={(e) =>
                    handleReviewClick(e, review.id, review.storeId)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className={styles.reviewTitle}>{review.title}</h3>
                  <p className={`${styles.reviewRate} ${styles.rate}`}>
                    <span className={styles.rate}>별점:</span> {review.rate}
                  </p>
                  <p className={styles.reviewContent}>{review.content}</p>
                  <p className={styles.reviewDate}>
                    Created At: {new Date(review.createdAt).toLocaleString()}
                  </p>
                  <p className={styles.reviewLikes}>
                    Likes: {review.likeCount}
                  </p>
                </div>
              ))}
            </div>
          </ul>
          <div className={styles.nameBox2}>
            <h1>나의 가게 목록</h1>
          </div>
          <ul>
            <div className={styles.storeContainer}>
              {storeList.map((store) => (
                <div
                  key={store.id}
                  className={styles.storeItem}
                  onClick={(e) => handleStoreClick(e, store.storeKey)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className={styles.storeTitle}>{store.title}</h3>
                  <p className={styles.storeCategory}>{store.category}</p>
                  <p className={styles.storeAddress}>{store.address}</p>
                  <p className={styles.storeHomePageLink}>
                    {store.homePageLink}
                  </p>
                </div>
              ))}
            </div>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MyPage

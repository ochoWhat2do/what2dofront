import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import { getCookie, setCookie } from '../../utils/cookie'
import styles from '../../styles/storeView.module.css'
import Link from 'next/link'
import MapContainer from '../../utils/mapContainer' // mapContainer.tsx를 import합니다.

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
  createEmail: string
  // 기타 리뷰 객체의 필드들을 여기에 추가합니다.
}

export default function Home() {
  const [storeModel, setStoreModel] = useState<Store | null>(null) // Updated state
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { storeKey, searchQuery } = router.query // 쿼리 파라미터 가져오기
  const indexHost = 'http://localhost:8080'
  const devHost = 'http://localhost:8080'
  const auth = getCookie('authorization')
  const bearer = 'Bearer '
  const [reviewList, setReviewList] = useState<Review[]>([])
  const [infowindow, setInfowindow] = useState<any>(null) // 인포윈도우 상태를 부모 컴포넌트에서 관리
  const [mapData, setMapData] = useState({
    address: '',
    latitude: '',
    longitude: '',
    title: '',
    keyword: '',
  })

  useEffect(() => {
    getStore()
  }, [])

  const getStore = async () => {
    try {
      const response = await axios.get(`${devHost}/api/stores/detail`, {
        params: {
          storeKey: storeKey,
        },
        headers: {
          Authorization: bearer + auth,
        },
      })
      setStoreModel(response.data) // Set the fetched data to the state
      if (response.data) {
        setMapData({
          address: response.data.address, // storeModel의 address 필드를 추가합니다.
          latitude: response.data.latitude, // storeModel의 latitude 필드를 추가합니다.
          longitude: response.data.longitude, // storeModel의 longitude 필드를 추가합니다.
          title: response.data.title,
          keyword: searchQuery?.toString() || '',
        })
      }
    } catch (error) {
      console.error('Error fetching store:', error)
    }
  }

  useEffect(() => {
    // Check if storeModel has a value before calling getReviews
    if (storeModel) {
      getReviews()
    }
  }, [storeModel])

  const getReviews = async () => {
    try {
      const response = await axios.get(
        `${devHost}/api/stores/${storeModel?.id}/reviews`,
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
      //console.log(response.data)
      const reviewList = response.data

      // Update the state with the reviewElements
      setReviewList(reviewList)
    } catch (error) {
      console.error('Error fetching 리뷰:', error)
    }
  }
  const handleReviewSaveClick = (e: React.MouseEvent) => {
    e.preventDefault() // 기본 이벤트(링크 이동) 방지
    const storeId = storeModel?.id

    // 페이지 이동 및 데이터 전달
    router.push({
      pathname: '/review/reviewSave',
      query: { storeId },
    })
  }

  const handleReviewClick = (e: React.MouseEvent, reviewId: number) => {
    e.preventDefault() // 기본 이벤트(링크 이동) 방지
    const storeIdStr = storeModel?.id.toString()
    const reviewIdStr = reviewId.toString()

    // 페이지 이동 및 데이터 전달
    router.push(
      {
        pathname: '/review/reviewDetail',
        query: { storeId: storeIdStr, reviewId: reviewIdStr },
      },
      '/review/reviewDetail',
    )
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.leftContent}>
          {/* 왼쪽 컨텐츠 영역 */}
          <div>
            <h2>가게 상세화면</h2>
            {storeModel && (
              <div className={styles['review-button-container']}>
                <button
                  className={styles['review-id-submit']}
                  onClick={(e) => handleReviewSaveClick(e)}
                  style={{ cursor: 'pointer' }}
                >
                  리뷰 등록
                </button>
              </div>
            )}
            {storeModel && (
              <div className={styles.storeItem}>
                <img
                  className={styles.storeImage}
                  src={storeModel.picture || '../images/not_found_square.png'}
                  alt=""
                />
                <div className={styles.storeInfo}>
                  <h2 className={styles.storeTitle}>{storeModel.title}</h2>
                  <p className={styles.storeCategory}>
                    카테고리: {storeModel.category}
                  </p>
                  <p className={styles.storeAddress}>
                    주소: {storeModel.address}
                  </p>
                  <p className={styles.storeRoadAddress}>
                    도로명 주소: {storeModel.roadAddress}
                  </p>
                  <p className={styles.storeHomePageLink}>
                    가게 링크: {storeModel.homePageLink}
                  </p>
                </div>
              </div>
            )}
            <h2>리뷰</h2>
            <div className={styles.reviewContainer}>
              {reviewList.map((review) => (
                <div
                  key={review.id}
                  className={styles.reviewItem}
                  onClick={(e) => handleReviewClick(e, review.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3 className={styles.reviewTitle}>{review.title}</h3>
                  <p className={`${styles.reviewcreateEmail} ${styles.label}`}>
                    <span className={styles.label}>작성자:</span>{' '}
                    {review.createEmail}
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
          </div>
        </div>
        {/* 오른쪽 컨텐츠 영역 */}
        <div className={styles.rightContent}>
          {/* mapContainer 컴포넌트를 포함하고 주소 및 좌표 데이터를 전달합니다. */}
          <MapContainer mapData={mapData} setInfowindow={setInfowindow} />
        </div>
      </div>
    </div>
  )
}

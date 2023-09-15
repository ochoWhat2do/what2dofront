import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import { getCookie, setCookie } from '../../utils/cookie'
import styles from '../../styles/storeView.module.css'
import Link from 'next/link'
import { KAKAO as KAKAOVALUE } from '../../variables/common'

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
  isFavorite: boolean
}
interface Review {
  id: number
  title: string
  content: string
  createdAt: Date
  likeCount: number
  createEmail: string
  createNickname: string
  rate: number
  // 기타 리뷰 객체의 필드들을 여기에 추가합니다.
}

declare global {
  interface Window {
    kakao: any
  }
}

export default function Home() {
  const [storeModel, setStoreModel] = useState<Store | null>(null) // Updated state
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { storeKey, searchQuery } = router.query // 쿼리 파라미터 가져오기
  const indexHost = 'http://localhost:8080'
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'
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
  const [mapScript, setMapScript] = useState<HTMLScriptElement | null>(null)
  const [places, setPlaces] = useState<any[]>([])
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null) // 찜 상태 추가
  const [reviewPageLength, setReviewPageLength] = useState(1) // 초기값은 1로 설정
  const [reviewCurrentPage, setReviewCurrentPage] = useState<number>(1) // 초기값은 1로 설정
  const [isLoadingMore, setIsLoadingMore] = useState(false) // 추가 데이터 로딩 상태

  useEffect(() => {
    getStore()
  }, [])

  const getStore = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/stores/detail`, {
        params: {
          storeKey: storeKey,
        },
        headers: {
          Authorization: bearer + auth,
        },
      })
      setStoreModel(response.data) // Set the fetched data to the state
      if (response.data) {
        if (response.data.favoriteYn) {
          setIsFavorite(true)
        } else {
          setIsFavorite(false)
        }
        setMapData({
          address: response.data.address, // storeModel의 address 필드를 추가합니다.
          latitude: response.data.latitude, // storeModel의 latitude 필드를 추가합니다.
          longitude: response.data.longitude, // storeModel의 longitude 필드를 추가합니다.
          title: response.data.title,
          keyword: searchQuery?.toString() || '',
        })
      }

      // mapScript를 생성하고 동적으로 스크립트를 추가하는 함수(카카오)
      const createMapScript = () => {
        const script = document.createElement('script')
        script.async = true
        const clientId = KAKAOVALUE.JAVASCRIPT_KEY
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${clientId}&autoload=false&libraries=services,clusterer,drawing`
        document.head.appendChild(script)
        setMapScript(script) // 스크립트 엘리먼트를 상태로 설정
      }

      if (typeof window !== 'undefined') {
        // 클라이언트 사이드에서만 실행되도록 조건 추가
        createMapScript()
      }
    } catch (error) {
      console.error('Error fetching store:', error)
    }
  }

  useEffect(() => {
    if (storeModel) {
      setReviewCurrentPage(1)
      getReviews()
    }
  }, [storeModel])

  const getReviews = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/stores/${storeModel?.id}/reviews`,
        {
          params: {
            page: reviewCurrentPage,
            size: 10,
            sortBy: 'createdAt',
            isAsc: false,
          },
          headers: {
            Authorization: bearer + auth,
          },
        },
      )

      const reviewPagingList = response.data
      if (reviewPagingList) {
        setReviewPageLength(reviewPagingList.pageCount)
        setReviewList(reviewPagingList.reviewList)
      }
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

  useEffect(() => {
    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const latitude = parseFloat(mapData.latitude)
        const longitude = parseFloat(mapData.longitude)
        const mapContainer = document.getElementById('map'),
          mapOption = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 3,
          }

        const map = new window.kakao.maps.Map(mapContainer, mapOption)
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude)

        // 결과값을 마커로 표시
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: markerPosition,
        })

        const openInfowindow = (content: string, marker: any) => {
          if (infowindow) {
            infowindow.close()
          }
          const newInfowindow = new window.kakao.maps.InfoWindow({
            content: content,
          })
          newInfowindow.open(map, marker)
          setInfowindow(newInfowindow)
        }

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div>${mapData.title}</div>`,
        })

        window.kakao.maps.event.addListener(marker, 'click', () => {
          openInfowindow(`<div>${mapData.title}</div>`, marker)
        })

        const keyword = mapData.keyword

        const placesSearch = new window.kakao.maps.services.Places()

        placesSearch.keywordSearch(keyword, (data: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            setPlaces(data)

            for (let i = 0; i < data.length; i++) {
              const placePosition = new window.kakao.maps.LatLng(
                parseFloat(data[i].y),
                parseFloat(data[i].x),
              )

              const placeMarker = new window.kakao.maps.Marker({
                position: placePosition,
                title: data[i].place_name,
              })

              window.kakao.maps.event.addListener(placeMarker, 'click', () => {
                openInfowindow(`<div>${data[i].place_name}</div>`, placeMarker)
              })

              placeMarker.setMap(map)
            }
          }
        })
      })
    }
    if (mapScript) {
      mapScript.addEventListener('load', onLoadKakaoMap)

      return () => {
        mapScript.removeEventListener('load', onLoadKakaoMap)
      }
    }
  }, [mapScript, mapData, setInfowindow])

  const handleFavoriteClick = async () => {
    // 현재 찜 상태를 반대로 설정하여 토글
    try {
      if (isFavorite) {
        // 찜하기 취소
        const response = await axios.delete(
          `${apiBaseUrl}/api/stores/${storeModel?.id}/storefavorites`,
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          },
        )
      } else {
        // 찜하기
        const response = await axios.post(
          `${apiBaseUrl}/api/stores/${storeModel?.id}/storefavorites`,
          null, // 데이터가 없는 경우 null로 설정
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          },
        )
      }
    } catch (error) {
      console.error('Error updating favorite status:', error)
    }
    setIsFavorite(!isFavorite)
  }

  // 리뷰 더 보기 버튼 클릭 시 실행되는 함수
  const handleLoadMoreReviews = async () => {
    setIsLoadingMore(true) // 로딩 중 상태로 변경
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/stores/${storeModel?.id}/reviews`,
        {
          params: {
            page: reviewCurrentPage + 1, // 다음 페이지 요청
            size: 10,
            sortBy: 'createdAt',
            isAsc: false,
          },
          headers: {
            Authorization: bearer + auth,
          },
        },
      )

      const newReviews = response.data.reviewList
      setReviewList((prevReviews) => [...prevReviews, ...newReviews]) // 새로운 리뷰를 기존 리뷰 목록에 추가
      setReviewCurrentPage((prevPage) => prevPage + 1) // 현재 페이지 업데이트
    } catch (error) {
      console.error('Error fetching more reviews:', error)
    } finally {
      setIsLoadingMore(false) // 로딩 완료 상태로 변경
    }
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.leftContent}>
          {/* 왼쪽 컨텐츠 영역 */}
          <div>
            <h2 className={styles.title1}>가게 상세화면</h2>
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
                  <img
                    src={
                      isFavorite
                        ? '/images/favorite_filled.png'
                        : '/images/favorite_empty.png'
                    }
                    alt="찜하기"
                    className={styles.favoriteIcon}
                    style={{ cursor: 'pointer' }}
                    onClick={handleFavoriteClick}
                  />
                </div>
              </div>
            )}
            <h2 className={styles.title1}>리뷰</h2>
            <div className={styles.reviewContainer}>
              {reviewList &&
                reviewList.map((review) => (
                  <div
                    key={review.id}
                    className={styles.reviewItem}
                    onClick={(e) => handleReviewClick(e, review.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3 className={styles.reviewTitle}>{review.title}</h3>
                    <p className={`${styles.reviewRate} ${styles.rate}`}>
                      <span className={styles.rate}>별점:</span> {review.rate}
                    </p>
                    <p
                      className={`${styles.reviewcreateEmail} ${styles.label}`}
                    >
                      <span className={styles.label}>작성자:</span>{' '}
                      {review.createNickname}
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
            {reviewPageLength > reviewCurrentPage && (
              <button
                className={`${styles.loadMoreButton} ${styles.horizontalCenter}`}
                onClick={handleLoadMoreReviews}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? '로딩 중...' : '리뷰 더 보기'}
              </button>
            )}
          </div>
        </div>
        {/* 오른쪽 컨텐츠 영역 */}
        <div className={styles.rightContent}>
          {/* MapContainer를 포함하고 mapData와 setInfowindow를 전달 */}
          <div id="map" className={styles.kakaoMap} />
        </div>
      </div>
    </div>
  )
}

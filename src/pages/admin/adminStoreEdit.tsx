import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import { getCookie, setCookie } from '../../utils/cookie'
import styles from '../../styles/admin/adminStoreEdit.module.css'
import ImageUploader from '../../utils/imageUploader'

interface Store {
  id: number
  title: string
  homePageLink: string
  category: string
  address: string
  roadAddress: string
  latitude: string
  longitude: string
  storeKey: string
  isFavorite: boolean
  images: S3FileDto[]
}

interface S3FileDto {
  originalFileName: string
  uploadFileName: string
  uploadFilePath: string
  uploadFileUrl: string
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

export default function AdminStoreEdit() {
  const [storeModel, setStoreModel] = useState<Store | null>(null) // Updated state
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { storeKey, searchQuery } = router.query // 쿼리 파라미터 가져오기
  const indexHost = 'http://localhost:8080'
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'
  const auth = getCookie('authorization')
  const bearer = 'Bearer '
  const [selectedImages, setSelectedImages] = useState<File[] | null>(null)

  useEffect(() => {
    getStore()
  }, [])

  const getStore = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/admin/stores/${storeKey}`,
        {
          headers: {
            Authorization: bearer + auth,
          },
        },
      )
      setStoreModel(response.data) // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching store:', error)
    }
  }

  const handleEditStore = () => {
    const shouldSave = window.confirm('가게를 수정하시겠습니까?')
    if (shouldSave) {
      editStore()
    }
  }

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(files) // 이미지 목록을 받아와 setSelectedImages를 호출하여 selectedImages를 업데이트
  }

  const editStore = async () => {
    try {
      const formData = new FormData()

      if (selectedImages) {
        selectedImages.forEach((file, index) => {
          formData.append('files', file)
          // selectedImages.forEach 루프를 사용하여 각 파일을 FormData에 추가하고 각 파일을 files[0], files[1], files[2], ...와 같이 인덱스를 사용하여 고유한 이름으로 저장
        })
      }

      const jsonBody = {
        locked: false,
      }

      formData.append(
        'requestDto',
        new Blob([JSON.stringify(jsonBody)], {
          type: 'application/json',
        }),
      )

      const response = await axios.put(
        `${apiBaseUrl}/admin/stores/${storeKey}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth}`,
          },
        },
      )

      window.alert('이미지를 수정하였습니다.')
      router.back()
    } catch (error: any) {
      window.alert(error.response.data.statusMessage)
      return
    }
  }

  const handleGoBack = () => {
    router.back() // 이전 페이지로 이동
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.leftContent}>
          {/* 왼쪽 컨텐츠 영역 */}
          <div>
            <h2 className={styles.title1}>관리자 가게 상세화면</h2>
            {storeModel && (
              <div className={styles.storeItem}>
                <img
                  className={styles.storeImage}
                  src={
                    storeModel.images && storeModel.images.length > 0
                      ? storeModel.images[0].uploadFileUrl
                      : '../images/not_found_square.png'
                  }
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
                <div className={styles['review-input-container']}>
                  <div className="review-id-label">이미지 첨부</div>
                  <ImageUploader
                    onImagesSelected={handleImagesSelected}
                    initialImages={storeModel?.images || []}
                  />
                  {/* onImagesSelected 콜백 전달 */}
                </div>
              </div>
            )}

            {storeModel && (
              <div className={styles['store-button-container']}>
                <button
                  className={styles['store-id-submit']}
                  onClick={handleEditStore}
                >
                  수정
                </button>
                <button
                  className={styles['store-id-cancel']}
                  onClick={handleGoBack}
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>
        {/* 오른쪽 컨텐츠 영역 */}
        <div className={styles.rightContent}></div>
      </div>
    </div>
  )
}

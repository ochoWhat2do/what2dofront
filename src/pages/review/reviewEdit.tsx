import React from 'react'
import Header from '../components/Header'
import { getCookie, setCookie } from '../../utils/cookie'
import styles from '../../styles/reviewEdit.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import ImageUploader from '../../utils/imageUploader'
import StarRating from '../../utils/starRating'

interface Review {
  id: number
  title: string
  content: string
  createdAt: Date
  likeCount: number
  rate: number
  attachment: S3FileDto[]
}

interface S3FileDto {
  originalFileName: string
  uploadFileName: string
  uploadFilePath: string
  uploadFileUrl: string
}

const reviewDetailPage = () => {
  const [reviewModel, setReviewModel] = useState<Review | null>(null) // Updated state
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { storeId, reviewId } = router.query // 쿼리 파라미터 가져오기
  const indexHost = 'http://localhost:8080'
  const devHost = 'http://localhost:8080'
  const auth = getCookie('authorization')
  const bearer = 'Bearer '

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [rate, setRate] = useState(0)
  const [selectedPictures, setSelectedPictures] = useState<File[] | null>(null)

  useEffect(() => {
    getReiview()
  }, [])

  const getReiview = async () => {
    try {
      const response = await axios.get(
        `${devHost}/api/stores/${storeId}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: bearer + auth,
          },
        },
      )
      const { title, content, rate } = response.data // 받아온 데이터에서 필요한 값을 추출
      setTitle(title)
      setContent(content)
      setRate(Number(rate))
      setReviewModel(response.data) // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching store:', error)
    }
  }

  const handleImagesSelected = (files: File[]) => {
    setSelectedPictures(files) // 이미지 목록을 받아와 setSelectedPictures를 호출하여 selectedPictures를 업데이트
  }

  const handleEditReview = () => {
    const shouldSave = window.confirm('리뷰를 수정하시겠습니까?')
    if (shouldSave) {
      editReview()
    }
  }

  const editReview = async () => {
    try {
      const formData = new FormData()

      if (selectedPictures) {
        selectedPictures.forEach((file, index) => {
          formData.append('files', file)
          // selectedPictures.forEach 루프를 사용하여 각 파일을 FormData에 추가하고 각 파일을 files[0], files[1], files[2], ...와 같이 인덱스를 사용하여 고유한 이름으로 저장
        })
      }

      const jsonBody = {
        title: title,
        content: content,
        rate: rate,
      }

      formData.append(
        'requestDto',
        new Blob([JSON.stringify(jsonBody)], {
          type: 'application/json',
        }),
      )

      const response = await axios.put(
        `${devHost}/api/stores/${storeId}/reviews/${reviewId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth}`,
          },
        },
      )

      window.alert('리뷰를 수정하였습니다.')
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
      <div className={styles['review-form']}>
        {' '}
        <div className={styles['review-title']}>리뷰 수정하기</div>
        <div className={styles['review-input-container']}>
          <div className="review-id-label">제목</div>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            className={styles['review-input-box']}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles['review-input-container']}>
          <div className="review-id-label">내용</div>
          <textarea
            name="content"
            id="content"
            className={styles['review-text-box']}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
        </div>
        <div className={styles['review-input-container']}>
          <div className="review-id-label">별점</div>
          {/* StarRating 컴포넌트에 rate 값을 전달 */}
          <StarRating
            size={20}
            rate={reviewModel?.rate ?? 0} // rate 값을 숫자로 변환해서 전달
            onRateChange={(newRate) => setRate(newRate)} // rate가 변경될 때 state 업데이트
          />
        </div>
        <div className={styles['review-input-container']}>
          <div className="review-id-label">이미지 첨부</div>
          <ImageUploader
            onImagesSelected={handleImagesSelected}
            initialImages={reviewModel?.attachment || []}
          />
          {/* onImagesSelected 콜백 전달 */}
        </div>
        <div className={styles['review-input-container']}>
          <button
            className={styles['review-id-submit']}
            onClick={handleEditReview}
          >
            수정
          </button>
          <button className={styles['review-id-delete']} onClick={handleGoBack}>
            취소
          </button>
        </div>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default reviewDetailPage

import React from 'react'
import Header from '../components/Header'
import { getCookie, setCookie } from '../../utils/cookie'
import styles from '../../styles/reviewSave.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

interface Review {
  id: number
  title: string
  content: string
  createdAt: Date
  likeCount: number
  attachment: Attachment
  rate: number
}

interface Attachment {
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
  const [commentList, setCommentList] = useState<Comment[]>([])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [rate, setRate] = useState('')
  const [selectedPicture, setselectedPicture] = useState<null | File>(
    null as File | null,
  )

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
      setReviewModel(response.data) // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching store:', error)
    }
  }

  useEffect(() => {
    // Check if storeModel has a value before calling getReviews
    if (reviewModel) {
      getComments()
    }
  }, [reviewModel])

  const getComments = async () => {
    try {
      const response = await axios.get(
        `${devHost}/api/stores/${storeId}/reviews/${reviewId}/comments`,
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
      const commentList = response.data

      // 댓글목록 업데이트
      setCommentList(commentList)
    } catch (error) {
      console.error('Error fetching 리뷰:', error)
    }
  }

  const handleReviewClick = (reviewId: string) => {
    // 이동할 경로를 생성하고 reviewId를 query parameter로 전달합니다.
    const pathname = '../review/reviewDetail' // reviewDetail.tsx 파일 경로에 맞게 수정
    const search = `1`

    // 페이지 이동
    router.push({
      pathname,
      search,
    })
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles['review-input-container']}>
            <div className="review-id-label">제목</div>
            <input
              type="title"
              name="title"
              id="title"
              className={styles['review-input-box']}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              readOnly
            />
          </div>
          <div className={styles['review-input-container']}>
            <div className="review-id-label">내용</div>
            <input
              type="text"
              name="content"
              id="content"
              className={styles['review-input-box']}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className={styles['review-input-container']}>
            <div className="review-id-label">평점</div>
            <input
              type="text"
              name="rate"
              id="rate"
              className={styles['review-input-box']}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div className={styles['review-input-container']}>
            <div className="review-id-label">프로필 사진</div>
            {/* <div className={styles['review-image-container']}>
            <img
              src={picture || '/images/ic-person.png'}
              alt="프로필 사진"
              className={`${styles['review-image']} ${styles['rounded']}`}
            />
          </div>
          <input
            type="file"
            id="review-pic"
            name="profilePic"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div> */}
            <div className={styles['review-input-container']}>
              <button className={styles['review-id-submit']}>등록</button>
              <button className={styles['review-id-cancel']}>취소</button>
            </div>
            <p>{message}</p>
          </div>
          {/* 오른쪽 컨텐츠 영역 */}
          <div className={styles.rightContent}>
            {/* 별도의 컨텐츠를 추가하세요 */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default reviewDetailPage

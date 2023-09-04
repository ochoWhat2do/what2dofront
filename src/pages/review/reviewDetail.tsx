import React from 'react'
import Header from '../components/Header'
import { getCookie, setCookie } from '../../utils/cookie'
import styles from '../../styles/reviewDetail.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

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

interface Comment {
  id: number
  content: string
  createdAt: Date
  likeCount: number
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
  const [reviewLikeCount, setReviewLikeCount] = useState('')

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
      setReviewLikeCount(response.data.likeCount)
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

  const handleReviewEditClick = (e: React.MouseEvent) => {
    e.preventDefault() // 기본 이벤트(링크 이동) 방지

    // 페이지 이동 및 데이터 전달
    router.push({
      pathname: '/review/reviewEdit',
      query: { storeId: storeId, reviewId: reviewId },
    })
  }

  const handleDeleteReview = () => {
    const shouldSave = window.confirm('리뷰를 삭제하시겠습니까?')
    if (shouldSave) {
      deleteReview()
    }
  }

  const deleteReview = async () => {
    try {
      await axios.delete(
        `${devHost}/api/stores/${storeId}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        },
      )
      window.alert('리뷰를 삭제 하였습니다.')
      router.push('/')
    } catch (error: any) {
      window.alert(error.response.data.statusMessage)
    }
  }

  const handleLikeClick = async () => {
    try {
      // 좋아요 요청 보내기
      const response = await axios.post(
        `${devHost}/api/stores/${storeId}/reviews/${reviewId}/likes`,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        },
      )
      if (response.data.liked) {
        setReviewLikeCount(reviewLikeCount + 1)
      }
    } catch (error) {
      // 오류 처리
      console.error('좋아요 요청 실패:', error)
    }
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.leftContent}>
          {/* 왼쪽 컨텐츠 영역 */}
          <div>
            <h2>리뷰 상세화면</h2>
            {reviewModel && (
              <div className={styles.reviewItem}>
                {/* 이미지 태그를 attachment의 개수에 따라 생성 */}
                {reviewModel.attachment &&
                  reviewModel.attachment.map((fileDto, index) => (
                    <img
                      key={index}
                      className={styles.reviewImage}
                      src={
                        fileDto.uploadFileUrl ||
                        '../images/not_found_square.png'
                      }
                      alt={`Image ${index}`}
                    />
                  ))}
                <div className={styles.reviewInfo}>
                  <h2 className={styles.reviewTitle}>
                    <span className={styles.label}>제목:</span>{' '}
                    {reviewModel.title}
                  </h2>
                  <p className={`${styles.reviewContent} ${styles.label}`}>
                    <span className={styles.label}>내용:</span>{' '}
                    {reviewModel.content}
                  </p>
                  <p className={`${styles.reviewDate} ${styles.label}`}>
                    <span className={styles.label}>작성일시:</span>{' '}
                    {new Date(reviewModel.createdAt).toLocaleString()}
                  </p>
                  <div onClick={handleLikeClick} className={styles.reviewLikes}>
                    <img src="/images/ic-like.png" alt="좋아요 아이콘" />
                    <input
                      type="text"
                      name="rate"
                      id="rate"
                      className={styles['review-input-like-box']}
                      value={reviewLikeCount}
                      onChange={(e) => setReviewLikeCount(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>
                <div className={styles['review-button-container']}>
                  <button
                    className={styles['review-id-move']}
                    onClick={(e) => handleReviewEditClick(e)}
                  >
                    수정
                  </button>
                  <button
                    className={styles['review-id-delete']}
                    onClick={handleDeleteReview}
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}
            <h2>댓글</h2>
            <div className={styles.commentContainer}>
              {commentList.length > 0 ? (
                commentList.map((comment) => (
                  <div key={comment.id} className={styles.reviewItem}>
                    <p className={styles.commentContent}>{comment.content}</p>
                    <p className={styles.commentDate}>
                      Created At: {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p className={styles.commentLikes}>
                      좋아요: {comment.likeCount}
                    </p>
                  </div>
                ))
              ) : (
                <p>댓글이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
        {/* 오른쪽 컨텐츠 영역 */}
        <div className={styles.rightContent}>
          {/* 별도의 컨텐츠를 추가하세요 */}
        </div>
      </div>
    </div>
  )
}

export default reviewDetailPage

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
  attachment: Attachment
}

interface Attachment {
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
          {/* 왼쪽 컨텐츠 영역 */}
          <div>
            <h2>리뷰 상세화면</h2>
            {reviewModel && (
              <div className={styles.reviewItem}>
                <img
                  className={styles.reviewImage}
                  src={
                    reviewModel.attachment.uploadFileUrl ||
                    '../images/not_found_square.png'
                  }
                  alt=""
                />
                <div className={styles.reviewInfo}>
                  <h2 className={styles.reviewTitle}>{reviewModel.title}</h2>
                  <p className={styles.reviewContent}>
                    내용: {reviewModel.content}
                  </p>
                  <p className={styles.reviewDate}>
                    작성일시 :{' '}
                    {new Date(reviewModel.createdAt).toLocaleString()}
                  </p>
                  <p className={styles.reviewLikes}>
                    좋아요: {reviewModel.likeCount}
                  </p>
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

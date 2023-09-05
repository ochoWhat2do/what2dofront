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
  createEmail: string
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
  const [commentContent, setCommentContent] = useState('')
  const [updateCommnetContent, setUpdateCommentContent] = useState('')
  const [reviewLikeCount, setReviewLikeCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 상태를 관리할 수 있는 새로운 state 추가
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState(false)

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
      if (response.data.liked) {
        setIsLiked(true)
      } else {
        setIsLiked(false)
      }
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

  const handleSubmitComment = async () => {
    if (commentContent.trim() === '') {
      // 댓글이 비어있으면 저장하지 않음
      return
    }

    setIsSubmitting(true)

    try {
      const requestDto = {
        content: commentContent,
      }

      await axios.post(
        `${devHost}/api/stores/${storeId}/reviews/${reviewId}/comments`,
        requestDto,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        },
      )

      // 댓글 저장 성공 시 여기에 추가 로직 작성 가능

      // 댓글 입력 필드 초기화
      setCommentContent('')

      // 저장 완료 후 상태 변경
      setIsSubmitting(false)
      // 댓글 저장 후 댓글 목록 다시 조회
      getComments()
    } catch (error) {
      // 오류 처리
      console.error('Error saving comment:', error)
      setIsSubmitting(false)
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
    // 이미 좋아요가 된 상태라면 -1 , 아니라면 + 1
    if (isLiked) {
      setReviewLikeCount(reviewLikeCount - 1)
      try {
        // 좋아요 요청 보내기
        const response = await axios.delete(
          `${devHost}/api/stores/${storeId}/reviews/${reviewId}/likes`,
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          },
        )
      } catch (error) {
        // 오류 처리
        console.error('좋아요 취소 요청 실패:', error)
      }
    } else {
      setReviewLikeCount(reviewLikeCount + 1)
      try {
        // 좋아요 요청 보내기
        const response = await axios.post(
          `${devHost}/api/stores/${storeId}/reviews/${reviewId}/likes`,
          null, // 데이터가 없는 경우 null로 설정
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          },
        )
      } catch (error) {
        // 오류 처리
        console.error('좋아요 요청 실패:', error)
      }
    }
    setIsLiked(!isLiked)
  }

  // 댓글 수정 함수
  const updateComment = async (commentId: number) => {
    try {
      // 수정된 댓글 내용을 서버로 전송
      const updatedComment = commentList.find(
        (comment) => comment.id === commentId,
      )
      if (!updatedComment) return

      await axios.put(
        `${devHost}/api/stores/${storeId}/reviews/${reviewId}/comments/${commentId}`,
        { content: updateCommnetContent },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        },
      )

      // 수정 모드 종료
      setEditingCommentId(null)
      // 댓글 저장 후 댓글 목록 다시 조회
      getComments()
    } catch (error) {
      // 오류 처리
      console.error('Error saving comment:', error)
    }
  }

  // 댓글 삭제 함수
  const deleteComment = async (commentId: number) => {
    try {
      await axios.delete(
        `${devHost}/api/stores/${storeId}/reviews/${reviewId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        },
      )
      window.alert('댓글을 삭제 하였습니다.')
      // 댓글 삭제 후, 화면에서 해당 댓글 제거
      const updatedCommentList = commentList.filter(
        (comment) => comment.id !== commentId,
      )
      setCommentList(updatedCommentList)
    } catch (error: any) {
      window.alert(error.response.data.statusMessage)
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
                  <p className={`${styles.reviewcreateEmail} ${styles.label}`}>
                    <span className={styles.label}>작성자:</span>{' '}
                    {reviewModel.createEmail}
                  </p>
                  <p className={`${styles.reviewContent} ${styles.label}`}>
                    <span className={styles.label}>내용:</span>{' '}
                    {reviewModel.content}
                  </p>
                  <p className={`${styles.reviewDate} ${styles.label}`}>
                    <span className={styles.label}>작성일시:</span>{' '}
                    {new Date(reviewModel.createdAt).toLocaleString()}
                  </p>
                  <div
                    onClick={handleLikeClick}
                    className={`${styles.reviewLikes} ${
                      isLiked ? styles.blueBorder : ''
                    }`}
                  >
                    <img src="/images/ic-like.png" alt="좋아요 아이콘" />
                    <input
                      type="text"
                      name="rate"
                      id="rate"
                      className={styles['review-input-like-box']}
                      value={reviewLikeCount}
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
            <div className={styles.comment_editor}>
              <textarea
                placeholder="댓글을 입력하세요..."
                value={commentContent}
                className={styles.comment_text_area}
                onChange={(e) => setCommentContent(e.target.value)}
              ></textarea>
              <button
                onClick={handleSubmitComment}
                disabled={isSubmitting}
                className={styles['comment-id-submit']}
              >
                저장
              </button>
            </div>
            <div className={styles.commentContainer}>
              {commentList.length > 0 ? (
                commentList.map((comment) => (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentLeftContainer}>
                      {/* 수정 중인 댓글인지 확인하고, input 상자 또는 텍스트로 렌더링 */}
                      {editingCommentId === comment.id ? (
                        <input
                          type="text"
                          className={styles.commentContentInput}
                          value={updateCommnetContent} // updateCommnetContent 사용
                          onChange={(e) =>
                            setUpdateCommentContent(e.target.value)
                          }
                        />
                      ) : (
                        <p className={styles.commentContent}>
                          {comment.content}
                        </p>
                      )}
                      <p className={styles.commentDate}>
                        Created At:{' '}
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                      <p className={styles.commentLikes}>
                        좋아요: {comment.likeCount}
                      </p>
                    </div>
                    <div className={styles.commentRightContainer}>
                      {/* 'ic-edit' 이미지를 클릭하면 수정 가능한 input 상자로 변경 */}
                      {editingCommentId === comment.id ? (
                        <button
                          className={styles['comment-id-update']}
                          onClick={() => updateComment(comment.id)}
                        >
                          수정
                        </button>
                      ) : (
                        <img
                          className={styles['comment-edit-img']}
                          src="/images/ic-edit.png"
                          alt="수정"
                          onClick={() => setEditingCommentId(comment.id)}
                        />
                      )}
                      {/* 'ic-delete' 이미지를 클릭하면 댓글 삭제 */}
                      <img
                        className={styles['comment-del-img']}
                        src="/images/ic-delete.png"
                        alt="삭제"
                        onClick={() => deleteComment(comment.id)}
                      />
                    </div>
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

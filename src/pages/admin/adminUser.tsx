import React from 'react'
import Header from '../components/Header'
import { getCookie, setCookie } from '../../utils/cookie'
import styles from '../../styles/admin/adminUser.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

const adminUserPage = () => {
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { storeId, reviewId, commentId } = router.query // 쿼리 파라미터 가져오기
  const indexHost = 'http://localhost:8080'
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'
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
  const loginUserInfo = getCookie('user_info')

  useEffect(() => {
    // getReiview()
  }, [])

  const handleAdminStore = () => {
    router.push('/admin/adminStore')
  }

  const handleMyUser = () => {
    router.push('/users/adminUser')
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.leftContent}>
          {/* 왼쪽 컨텐츠 영역 */}
          <div>
            <h2 className={styles.menuTitle}>사용자 관리 화면</h2>
            <div className={styles.adminMenus}>
              <ul>
                {/* <li className={styles.navItem}>
                  <button onClick={handleAdminStore}>상점 관리</button>
                </li>
                <li className={styles.navItem}>
                  <button onClick={handleMyUser}>사용자 관리</button>
                </li> */}
              </ul>
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

export default adminUserPage

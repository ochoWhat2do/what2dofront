import React from 'react'
import Header from '../components/Header'
import { getCookie, setCookie } from '../../utils/cookie'
import styles from '../../styles/admin/adminStore.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

interface Store {
  title: string
  homePageLink: string
  category: string
  address: string
  roadAddress: string
  latitude: string
  longitude: string
  storeKey: string
  images: S3FileDto[]
}

interface S3FileDto {
  originalFileName: string
  uploadFileName: string
  uploadFilePath: string
  uploadFileUrl: string
}

const adminStorePage = () => {
  const [storeList, setStoreList] = useState<Store[]>([]) // Updated state
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { storeId, reviewId, commentId } = router.query // 쿼리 파라미터 가져오기
  const indexHost = 'http://localhost:8080'
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'
  const auth = getCookie('authorization')
  const bearer = 'Bearer '
  const [searchQuery, setSearchQuery] = useState('')
  const [commentList, setCommentList] = useState<Comment[]>([])
  const [commentContent, setCommentContent] = useState('')
  const [updateCommnetContent, setUpdateCommentContent] = useState('')
  const [reviewLikeCount, setReviewLikeCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 상태를 관리할 수 있는 새로운 state 추가
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [initYn, setInitYn] = useState(false) // 초기값은 false로 설정
  const loginUserInfo = getCookie('user_info')
  const [pageCount, setPageCount] = useState(1) // 초기값은 1로 설정
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    if (auth && !initYn) {
      getStoreList() // true 값 추가: 초기 호출임을 나타내는 플래그
      setInitYn(true) // 초기화를 마쳤음을 나타내는 플래그를 true로 설정
    }
  }, [])

  const getStoreList = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/admin/stores`, {
        params: {
          keyword: searchQuery,
          page: currentPage,
          size: 15,
          sortBy: 'id',
          isAsc: false,
        },
        headers: {
          Authorization: bearer + auth,
        },
      })
      setPageCount(response.data.pageCount) // 15는 페이지당 게시글 수
      setStoreList(response.data.storeList) // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pageCount) {
      return // 페이지 번호가 유효 범위를 벗어나면 아무 작업도 하지 않음
    }
    setCurrentPage(pageNumber)
  }

  const handleEditStore = (storeKey: string) => {
    editStore(storeKey)
  }

  const editStore = async (storeKey: string) => {
    try {
      // query
      router.push(
        {
          pathname: '/admin/adminStoreEdit',
          query: { storeKey: storeKey },
        },
        '/admin/adminStoreEdit',
      )
    } catch (error: any) {
      window.alert(error.response.data.statusMessage)
      return
    }
  }

  // currentPage가 변경될 때마다 getStoreList 실행
  useEffect(() => {
    if (initYn) {
      getStoreList()
    }
  }, [currentPage])

  return (
    <div>
      <Header />
      <div className={styles.container}>
        {/* 왼쪽 컨텐츠 영역 */}
        <div>
          <div className={styles.title}>맛집 검색결과</div>
          <div className={`flex flex-wrap ${styles['flex-store']}`}>
            {storeList.length > 0 ? (
              storeList.map((store, index) => (
                <div
                  key={index}
                  className="w-1/3"
                  style={{ marginBottom: '20px' }}
                >
                  {/* Adjusted class here */}
                  <section className="box feature">
                    <img
                      className={styles.storeImage}
                      src={
                        store.images && store.images.length > 0
                          ? store.images[0].uploadFileUrl
                          : 'images/not_found_square.png'
                      }
                      alt=""
                      onClick={() => handleEditStore(store.storeKey)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div className="inner">
                      <input
                        type="hidden"
                        data-id={`list${index}`}
                        value={store.storeKey}
                      />
                      <header>
                        <h2>{store.title}</h2>
                      </header>
                      <p>{store.category}</p>
                      <br />
                      <p>{store.address}</p>
                    </div>
                  </section>
                </div>
              ))
            ) : (
              <p>검색된 가게가 없습니다.</p>
            )}
            {storeList.length > 0 ? (
              <div className={styles.storePagingBox}>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <span
                      key={pageNumber}
                      className={`${styles.pagenum} ${
                        pageNumber === currentPage ? styles.active : ''
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                      style={{ cursor: 'pointer' }}
                    >
                      {pageNumber}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p>검색된 가게가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default adminStorePage

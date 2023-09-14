import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import axios from 'axios'
import { getCookie, setCookie } from '../utils/cookie'
import { useRouter } from 'next/router'
import styles from '../styles/index.module.css'
import Footer from './components/Footer'

interface Store {
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

export default function Home() {
  const [storeList, setStoreList] = useState<Store[]>([]) // Updated state
  const router = useRouter()
  const bearer = 'Bearer '
  const indexHost = 'http://localhost:8080'
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080'
  const auth = getCookie('authorization')
  const query = '강남구 맛집' // Replace with the actual query
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOption, setSelectedOption] = useState('keyword') // 초기 선택값
  const [pageLength, setPageLength] = useState(1) // 초기값은 1로 설정
  const [currentPage, setCurrentPage] = useState<number>(1) // 초기값은 1로 설정
  const [storeListByReview, setStoreListByReview] = useState<Store[]>([]) // Updated state

  useEffect(() => {
    if (auth) {
      setSearchQuery(query)
      getStoreList(query)
      getStoreListByReview()
    }
  }, [])

  const handleViewStore = (storeKey: string) => {
    viewStore(storeKey)
  }

  const viewStore = async (storeKey: string) => {
    try {
      // query
      router.push(
        {
          pathname: '/store/storeView',
          query: { storeKey: storeKey, searchQuery: searchQuery },
        },
        '/store/storeView',
      )
    } catch (error: any) {
      window.alert(error.response.data.statusMessage)
      return
    }
  }

  const getStoreList = async (searchQuery: string) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/daum/search`, {
        params: {
          query: searchQuery,
          page: currentPage,
        },
        headers: {
          Authorization: bearer + auth,
        },
      })
      setPageLength(
        Math.ceil(response.data.pageCnt / response.data.storeList.length),
      ) // 15는 페이지당 게시글 수
      setStoreList(response.data.storeList) // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // 검색 버튼 클릭 시 처리 함수
  const handleSearch = () => {
    // 검색 쿼리에 대한 처리를 추가하세요.
    if (!searchQuery) {
      window.alert('검색어를 입력하세요.')
      return
    }

    // 검색어가 띄어쓰기로 2개의 단어로 이루어져 있는지 확인
    const words = searchQuery.split(' ')
    if (words.length !== 2) {
      window.alert('검색어는 2개의 단어로 이루어져야 합니다.')
      return
    }

    // 검색어에 "맛집" 포함여부 확인
    if (!words.some((word) => ['맛집'].includes(word))) {
      window.alert("검색어에 '맛집'을 포함해야 합니다.")
      return
    }

    if (auth) {
      if (selectedOption === 'keyword') {
        getStoreList(searchQuery)
      } else if (selectedOption === 'category') {
        getStoreListByCategory(searchQuery)
      }
    }
  }

  const getStoreListByCategory = async (categoryQuery: string) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/stores/search`, {
        params: {
          category: categoryQuery,
          page: currentPage,
        },
        headers: {
          Authorization: bearer + auth,
        },
      })

      if (response.data) {
        const formattedData = response.data.storeCategoryList.map(
          (item: any) => ({
            title: item.title,
            homePageLink: item.homePageLink,
            category: item.category,
            address: item.address,
            roadAddress: item.roadAddress,
            latitude: item.latitude,
            longitude: item.longitude,
            picture: item.picture,
            storeKey: item.storeKey,
          }),
        )

        setStoreList(formattedData)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pageLength) {
      return // 페이지 번호가 유효 범위를 벗어나면 아무 작업도 하지 않음
    }
    setCurrentPage(pageNumber)
  }

  // currentPage와 selectedOption가 변경될 때마다 getStoreList 실행
  useEffect(() => {
    if (selectedOption === 'keyword') {
      getStoreList(searchQuery)
    } else if (selectedOption === 'category') {
      getStoreListByCategory(searchQuery)
    }
  }, [currentPage])

  // const handleStoreListByReview = () => {
  //   router.push('/store/storeListByReview')
  // }

  const getStoreListByReview = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/stores/list-review`, {
        params: {
          page: 1,
          size: 5,
          sortBy: 'createdAt',
          isAsc: false,
        },
        headers: {
          Authorization: bearer + auth,
        },
      })

      setStoreListByReview(response.data) // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  return (
    <div>
      <Header />
      <h1>홈 페이지</h1>
      <div>
        <h2>메인화면</h2>
        <div className="index-container">
          <div className={styles.searchBox}>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              style={{ width: '120px', fontSize: '14px' }}
            >
              <option value="keyword">검색어</option>
              <option value="category">카테고리</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력하세요(검색 형식: 지역명+맛집)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>
              <img
                src="/images/ic-search.png"
                alt="검색"
                style={{ width: '40px', height: '40px' }}
              />
            </button>
          </div>
          <div className={`flex flex-wrap ${styles['flex-store']}`}>
            {storeList.length > 0 ? (
              storeList.map((store, index) => (
                <div key={index} className="w-1/3">
                  {/* Adjusted class here */}
                  <section className="box feature">
                    <img
                      src={store.picture || 'images/not_found_square.png'}
                      alt=""
                      onClick={() => handleViewStore(store.storeKey)}
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
                {Array.from({ length: pageLength }, (_, i) => i + 1).map(
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
          <div>리뷰가 많은 맛집</div>
          <div className={`flex flex-wrap ${styles['flex-store']}`}>
            {storeListByReview && storeListByReview.length > 0 ? (
              storeListByReview.map((store, index) => (
                <div key={index} className="w-1/3">
                  {/* Adjusted class here */}
                  <section className="box feature">
                    <img
                      src={store.picture || 'images/not_found_square.png'}
                      alt=""
                      onClick={() => handleViewStore(store.storeKey)}
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import axios from 'axios'
import { getCookie, setCookie } from '../utils/cookie'
import { useRouter } from 'next/router'
import styles from '../styles/index.module.css'

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
  const devHost = 'http://localhost:8080'
  const auth = getCookie('authorization')
  const query = '강남구' // Replace with the actual query
  const page = '1' // Replace with the actual page
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOption, setSelectedOption] = useState('keyword') // 초기 선택값

  useEffect(() => {
    if (auth) {
      getStoreList(query)
    }
  }, [])

  const handleViewStore = (storeKey: string) => {
    viewStore(storeKey)
  }

  const viewStore = async (storeKey: string) => {
    try {
      router.push({
        pathname: `/store/storeView`,
        search: `storeKey=${storeKey}`,
      })
    } catch (error: any) {
      window.alert(error.response.data.statusMessage)
      return
    }
  }

  const getStoreList = async (searchQuery: string) => {
    try {
      const response = await axios.get(`${devHost}/api/daum/search`, {
        params: {
          query: searchQuery,
          page: page,
        },
        headers: {
          Authorization: bearer + auth,
        },
      })

      console.log(response.data)
      setStoreList(response.data) // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // 검색 버튼 클릭 시 처리 함수
  const handleSearch = () => {
    // 검색 쿼리에 대한 처리를 추가하세요.
    console.log('검색어:', searchQuery)
    if (!searchQuery) {
      window.alert('검색어를 입력하세요.')
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
      const response = await axios.get(`${devHost}/api/stores/search`, {
        params: {
          category: categoryQuery,
          page: page,
        },
        headers: {
          Authorization: bearer + auth,
        },
      })
      debugger
      console.log(response.data)
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
              placeholder="검색어를 입력하세요"
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
    </div>
  )
}

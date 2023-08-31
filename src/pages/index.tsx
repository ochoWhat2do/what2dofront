import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import axios from 'axios'
import { getCookie, setCookie } from '../utils/cookie'
import { useRouter } from 'next/router'

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

  useEffect(() => {
    if (auth) {
      getStoreList()
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

  const getStoreList = async () => {
    try {
      const response = await axios.get(`${devHost}/api/daum/search`, {
        params: {
          query: query,
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

  return (
    <div>
      <Header />
      <h1>홈 페이지</h1>
      <div>
        <h2>메인화면</h2>
        <div className="container">
          <div className="flex flex-wrap">
            {storeList.map((store, index) => (
              <div key={index} className="w-1/3">
                {/* Adjusted class here */}
                <section className="box feature">
                  <img
                    className="hover:cursor-pointer"
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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

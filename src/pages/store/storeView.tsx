import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import { getCookie, setCookie } from '../../utils/cookie'

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
  const [storeModel, setstoreModel] = useState<Store>() // Updated state
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { storeKey } = router.query // 쿼리 파라미터 가져오기
  const indexHost = 'http://localhost:8080'
  const devHost = 'http://localhost:8080'
  const auth = getCookie('authorization')
  const bearer = 'Bearer '
  useEffect(() => {
    getStore()
    getReviews()
  }, [])

  const getStore = async () => {
    try {
      const response = await axios.get(`${devHost}/api/stores/detail`, {
        params: {
          storeKey: storeKey,
        },
        headers: {
          Authorization: bearer + auth,
        },
      })

      // console.log(response.data)
      setstoreModel(response.data) // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching store:', error)
    }
  }

  const getReviews = async () => {
    try {
      // const response = await axios.get(`${devHost}/api/stores/detail`, {
      //   params: {
      //     storeKey: storeKey,
      //   },
      //   headers: {
      //     Authorization: bearer + auth,
      //   },
      // })
      // // console.log(response.data)
      // setstoreModel(response.data) // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching 리뷰:', error)
    }
  }

  return (
    <div>
      <Header />
      <div>
        <h2>가게 상세화면</h2>
        <div className="container">
          <div className="flex flex-wrap">
            <div key={storeModel?.storeKey} className="w-1/3">
              {/* Adjusted class here */}
              <section className="box feature">
                <img
                  className="hover:cursor-pointer"
                  src={storeModel?.picture || '../images/not_found_square.png'}
                  alt=""
                />
                <div className="inner">
                  <input
                    type="hidden"
                    data-id={`list${storeKey}`}
                    value={storeModel?.storeKey}
                  />
                  <header>
                    <h2>제목 : {storeModel?.title}</h2>
                  </header>
                  <p>카테고리 : {storeModel?.category}</p>
                  <br />
                  <p>주소 : {storeModel?.address}</p>
                  <br />
                  <p>도로명 주소 : {storeModel?.roadAddress}</p>
                  <br />
                  <p>가게 링크 : {storeModel?.homePageLink}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2>리뷰</h2>
      </div>
    </div>
  )
}

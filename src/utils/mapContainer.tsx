import React, { useEffect, useState } from 'react'
import styles from '../styles/util/mapContainer.module.css'
import { KAKAO as KAKAOVALUE } from '../variables/common'

declare global {
  interface Window {
    kakao: any
  }
}

interface MapData {
  address: string
  latitude: string
  longitude: string
  title: string
  keyword: string
}

const MapContainer: React.FC<{
  mapData: MapData
  setInfowindow: (infowindow: any) => void
}> = ({ mapData, setInfowindow }) => {
  const mapScript = document.createElement('script')
  const [places, setPlaces] = useState<any[]>([])
  mapScript.async = true
  mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAOVALUE.JAVASCRIPT_KEY}&autoload=false&libraries=services,clusterer,drawing`
  document.head.appendChild(mapScript)

  useEffect(() => {
    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        // 예시 위도 경도 33.450701, 126.570667
        const latitude = parseFloat(mapData.latitude)
        const longitude = parseFloat(mapData.longitude)

        // 지도 생성
        const mapContainer = document.getElementById('map'), // 지도를 표시할 div
          mapOption = {
            center: new window.kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
            level: 3, // 지도의 확대 레벨
          }

        const map = new window.kakao.maps.Map(mapContainer, mapOption)
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude)

        // 결과값을 마커로 표시
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: markerPosition,
        })

        const openInfowindow = (content: string, marker: any) => {
          if (infowindow) {
            infowindow.close()
          }
          const newInfowindow = new window.kakao.maps.InfoWindow({
            content: content,
          })
          newInfowindow.open(map, marker)
          setInfowindow(newInfowindow) // 인포윈도우 상태를 업데이트
        }

        // 마커 클릭 시 나타날 인포윈도우 생성
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div>${mapData.title}</div>`, // 타이틀을 인포윈도우 내부에 추가
        })

        // 마커 클릭 이벤트 리스너 등록
        window.kakao.maps.event.addListener(marker, 'click', () => {
          openInfowindow(`<div>${mapData.title}</div>`, marker)
        })

        // 지도의 중심을 결과값으로 받은 위치로 이동  이미 중심 좌표를 mapOption에서 설정하고 지도를 생성할 때 중심 좌표를 기준으로 지도를 만들기 때문에 중복 제거
        //marker.setMap(map)

        // 검색할 키워드
        const keyword = mapData.keyword

        // 장소 검색 객체를 생성합니다
        const placesSearch = new window.kakao.maps.services.Places()

        // 키워드로 장소를 검색합니다
        placesSearch.keywordSearch(keyword, (data: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            // 검색 결과로 받은 위치 정보를 state에 저장
            setPlaces(data)

            // 검색된 장소 위치에 마커를 표시합니다
            for (let i = 0; i < data.length; i++) {
              const placePosition = new window.kakao.maps.LatLng(
                parseFloat(data[i].y),
                parseFloat(data[i].x),
              )

              const placeMarker = new window.kakao.maps.Marker({
                position: placePosition,
                title: data[i].place_name, // 장소 이름을 마커 타이틀로 설정
              })

              // 마커 클릭 이벤트 리스너 등록
              window.kakao.maps.event.addListener(placeMarker, 'click', () => {
                openInfowindow(`<div>${data[i].place_name}</div>`, placeMarker)
              })

              placeMarker.setMap(map)
            }
          }
        })
      })
    }
    mapScript.addEventListener('load', onLoadKakaoMap)

    return () => mapScript.removeEventListener('load', onLoadKakaoMap)
  }, [mapData, setInfowindow])

  return <div id="map" className={styles.kakaoMap} />
}

export default MapContainer

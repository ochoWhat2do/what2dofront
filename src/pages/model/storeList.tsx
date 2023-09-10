import React from 'react'

interface Store {
  title: string
  homePageLink: string
  category: string
  address: string
  roadAddress: string
  latitude: string
  longitude: string
  picture: string
}

interface StoreListProps {
  storeList: Store[] | null // null을 허용하는 타입으로 정의
}

const StoreList: React.FC<StoreListProps> = ({ storeList }) => {
  StoreList.defaultProps = {
    storeList: [], // 기본값 설정
  }
  if (!storeList) {
    // storeList가 null일 때, 메시지를 표시하거나 다른 처리를 수행
    return <p>가게 목록이 없습니다.</p>
  }

  return (
    <div className="container">
      <div className="row">
        {storeList.map((store, index) => (
          <div key={index} className="col-4 col-12-medium">
            <section className="box feature">
              <a
                href={store.homePageLink}
                className="image featured"
                target="_blank"
              >
                <img
                  src={store.picture || 'images/not_found_square.png'}
                  alt=""
                />
              </a>
              <div className="inner">
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
  )
}

export default StoreList

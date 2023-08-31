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
  storeList: Store[]
}

const StoreList: React.FC<StoreListProps> = ({ storeList }) => {
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

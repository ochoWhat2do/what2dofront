import React, { useEffect } from 'react'
import styles from '../styles/util/addr.module.css' // Import login.module.css

export interface IAddr {
  address: string
  zonecode: string
}

// window 객체에 대한 타입 선언
declare global {
  interface Window {
    daum: any
  }
}

interface IAddrProps {
  onSelectAddr: (data: IAddr) => void // 주소 선택 시 호출될 콜백 함수
}

const Addr: React.FC<IAddrProps> = ({ onSelectAddr }) => {
  const onClickAddr = () => {
    new window.daum.Postcode({
      oncomplete: function (data: IAddr) {
        onSelectAddr(data) // 주소 선택 시 콜백 함수 호출
      },
    }).open()
  }

  useEffect(() => {
    // 다음 주소 검색 API 스크립트 동적으로 로드
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // 컴포넌트가 언마운트될 때 스크립트 삭제
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div>
      {/* <input id="addr" type="text" readOnly /> */}
      <button onClick={onClickAddr} className={styles['address-id-search']}>
        검색
      </button>
      {/* <input
        id="zipNo"
        type="text"
        readOnly
        className={styles['zipcode-input-box']}
      />
      <input
        id="addrDetail"
        type="text"
        className={styles['address-input-box']}
      /> */}
    </div>
  )
}

export default Addr

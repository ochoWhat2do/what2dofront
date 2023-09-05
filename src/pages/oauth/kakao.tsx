import axios from 'axios'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { setCookie } from '../../utils/cookie'

const Kakao = () => {
  const router = useRouter()
  //backend 주소
  const indexHost = 'http://localhost:8080' // 로컬
  const devHost = 'http://localhost:8080' // 개발
  const [message, setMessage] = useState('')
  const handleKakaoCallback = async (code: string | string[] | undefined) => {
    try {
      if (code) {
        // 카카오 서버로부터 액세스 토큰 요청
        const response = await axios.post(`${devHost}/oauth/kakao?code=${code}`)

        if (response.status === 200) {
          // 엑세스 토큰과 리프레시 토큰을 받았다
          if (response.headers['authorization']) {
            setCookie('authorization', response.headers['authorization'], {
              path: '/',
              secure: true,
              sameSite: 'none',
            })
            setCookie(
              'authorization_refresh',
              response.headers['authorization_refresh'],
              {
                path: '/',
                secure: true,
                sameSite: 'none',
              },
            )

            router.push('/')
          }
        }
      }
    } catch (error) {
      setMessage('로그인 중 오류가 발생했습니다.')
    }
  }

  useEffect(() => {
    // 페이지가 렌더링될 때 카카오에서 전달받은 코드를 확인하고 처리합니다.
    const { code } = router.query
    if (Array.isArray(code)) {
      // 배열로 코드가 오는 경우 첫 번째 코드를 사용
      handleKakaoCallback(code[0])
    } else {
      // 문자열로 코드가 오는 경우 바로 처리
      handleKakaoCallback(code)
    }
  }, [router.query.code]) // 이펙트가 실행되는 조건을 설정합니다.

  return <div></div>
}

export default Kakao

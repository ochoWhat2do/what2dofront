import getConfigs from './config.common'

// 환경마다 달라져야 할 변수, 값들을 정의합니다. (여기는 dev 환경에 맞는 값을 지정합니다.)
const baseUrl = 'https://api.what2do.shop'
const mode = 'development'
const kakaoRedirectUrl = 'https://www.what2do.co.kr/oauth/kakao'

// 환경마다 달라져야 할 값들을 getConfig 함수에 전달합니다.
const configDev = getConfigs({
  baseUrl,
  mode,
  kakaoRedirectUrl,
})

export default configDev

import getConfigs from './config.common'

// 환경마다 달라져야 할 변수, 값들을 정의합니다. (여기는 dev 환경에 맞는 값을 지정합니다.)
const baseUrl =
  'http://ec2-15-165-220-35.ap-northeast-2.compute.amazonaws.com:8080'
const mode = 'development'

// 환경마다 달라져야 할 값들을 getConfig 함수에 전달합니다.
const configDev = getConfigs({
  baseUrl,
  mode,
})

export default configDev

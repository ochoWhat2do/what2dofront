import { KAKAO as KAKAO_CONFIG } from './kakaoKey'
import { GOOGLE as GOOGLE_CONFIG } from './googleKey'

const KAKAO = {
  LOGIN_URL: KAKAO_CONFIG.LOGIN_URL,
  TOKEN_URI: KAKAO_CONFIG.TOKEN_URI,
  USER_INFO_URI: KAKAO_CONFIG.USER_INFO_URI,
  CLIENT_ID: KAKAO_CONFIG.CLIENT_ID,
  JAVASCRIPT_KEY: KAKAO_CONFIG.JAVASCRIPT_KEY,
}

const GOOGLE = {
  LOGIN_URL: GOOGLE_CONFIG.LOGIN_URL,
  CLIENT_ID: GOOGLE_CONFIG.CLIENT_ID,
}

export { KAKAO, GOOGLE }

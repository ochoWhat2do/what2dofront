import { Cookies } from 'react-cookie'

const cookies = new Cookies()

export const setCookie = (name: string, value: string, option?: any) => {
  return cookies.set(name, value, { ...option })
}

export const getCookie = (name: string) => {
  return cookies.get(name)
}

export const removeCookie = (name: string) => {
  return cookies.remove(name, { path: '/', maxAge: 0 }) // maxAge를 0으로 설정하여 지속 시간을 0으로 만듭니다.
}

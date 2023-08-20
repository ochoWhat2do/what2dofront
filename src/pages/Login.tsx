import {useState} from 'react'
import AxiosC from '../common/AxiosC'
import {removeCookie, setCookie} from '../common/Cookie'

export default function Login() {
  const [user, setUser] = useState({email: '', pw: ''})

  /** Get User Login Info */
  const onChange = async (event: any) => {
    const {name, value} = event.target
    setUser({
      ...user,
      [name]: value
    })
  }

  /** Get Login Response from Server */
  const clickBtnLogin = async () => {
    try {
      const config = {
        method: 'post',
        url: 'http://localhost:8080/api/users/login',
        data: JSON.stringify({email: user.email, password: user.pw})
      }
      const response = await AxiosC(config)
      const token = response.headers['authorization']
      if (token) {
        setCookie('authorization', token)
      }
    } catch (error) {
      console.error(error)
    }
  }

  /** Logout */
  const clickBtnLogout = async () => {
    removeCookie('authorization')
  }

  return (
    <div>
      <input onChange={onChange} name="email" type="text" placeholder="Enter Ur Email" />
      <input onChange={onChange} name="pw" type="password" placeholder="Enter Ur pw" />
      <button onClick={clickBtnLogin}>LOGIN</button>
      <button onClick={clickBtnLogout}>LOGOUT</button>
    </div>
  )
}

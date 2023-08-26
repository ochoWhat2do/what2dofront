import { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import { useCookies } from "react-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  // const [cookies, setCookie] = useCookies([
  //   "Authorization",
  //   "Authorization_refresh",
  // ]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        setMessage("로그인이 성공적으로 완료되었습니다.");
        // const token = response.headers.authorization;
        // const refreshToken = response.headers.authorization_refresh;

        // setCookie("Authorization", token, { path: "/" });
        // setCookie("Authorization_refresh", refreshToken, { path: "/" });

        window.location.href = "/";
      }
    } catch (error) {
      setMessage("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <h1>로그인 페이지</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
      <p>{message}</p>
    </div>
  );
};

export default Login;

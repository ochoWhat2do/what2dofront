import { useState } from "react";
import axios from "axios";
import Header from "./components/Header";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/signup",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        setMessage("회원가입이 성공적으로 완료되었습니다.");
      }
    } catch (error) {
      setMessage("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <h1>회원가입 페이지</h1>
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
      <button onClick={handleSignup}>회원가입</button>
      <p>{message}</p>
    </div>
  );
};

export default Signup;

import React, { useEffect } from "react";
import Header from "./components/Header";
import { UserInfoComponent } from "../utils/auth";
import { useCookies } from "react-cookie"; // Import useCookies hook here

export default function Home() {
  useEffect(() => {
    // 컴포넌트 렌더링 이후에 실행되는 코드
    const fetchUserInfo = async () => {
      const auth = await UserInfoComponent(); // UserInfoComponent 실행
      if (auth) {
        const { email } = auth;
        console.log("Logged in as:", email);

        // 여기에서 필요한 작업을 수행할 수 있습니다.
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <Header />
      <h1>홈 페이지</h1>
      <div>
        <h2>메인화면</h2>
      </div>
    </div>
  );
}

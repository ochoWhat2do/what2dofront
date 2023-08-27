import React, { useEffect } from "react";
import Header from "./components/Header";
import { useCookies } from "react-cookie"; // Import useCookies hook here

export default function Home() {
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

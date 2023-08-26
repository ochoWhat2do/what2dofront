// auth.ts
import axios from "axios";
// import { useCookies } from "react-cookie";

const otherHost = "http://localhost:8080";
// export const useAuthCookies = () => {
//   const [cookies, setCookie] = useCookies(["Authorization"]); // useCookies 훅에서 setCookie 함수도 가져오기

//   // 커스텀 훅으로 래핑된 cookies와 setCookie 반환
//   return { cookies, setCookie };
// };

export const setAuthHeader = (auth: string) => {
  axios.defaults.headers.common["Authorization"] = auth;
};

export const UserInfoComponent = async (): Promise<{
  email: string;
  role: string;
} | null> => {
  // async 함수로 변경
  // const { cookies } = useAuthCookies(); // cookies와 setCookie를 가져오기

  // const auth = cookies["Authorization"];
  // if (!auth) {
  //   window.location.href = "/login";
  //   return null;
  // }

  try {
    const response = await axios.get(`${otherHost}/api/users/info`);
    const responseData = response.data;

    if (!responseData.email) {
      window.location.href = "/login";
      return null;
    }

    const { email, admin } = responseData; // responseData에서 필요한 데이터 추출
    return { email, role: admin ? "ADMIN" : "USER" };
  } catch (error) {
    // Handle error or logout if needed
    return null;
  }
};

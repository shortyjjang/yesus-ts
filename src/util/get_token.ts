
import dayjs from "dayjs";
import Cookies from "js-cookie";;
import { AuthApi } from "./api";

export const getaccessToken = async () => {
    let username = '',
      nickname = '',
      expires = dayjs().toDate();
    try {
      const request = await AuthApi.post("/token-refresh");
      if (request.data.access_token) {
        const { access_token } = request.data;
        username = request.data.username;
        nickname = request.data.nickname;
        expires = dayjs().add(29, "minute").toDate();
  
        Cookies.set("accessToken", access_token, {
          expires: 1 / 48.5,
        });
        return {
            username: username,
            nickname: nickname,
            expires: expires,
          }
      } else {
        console.log("임시처리: refresh 실패");
        return {
            username: username,
            nickname: nickname,
            expires: expires,
        }
      }
    } catch (e) {
        console.log("임시처리: refresh 실패");
        return {
            username: '',
            nickname: '',
            expires: new Date(),
        }
    }
  };



import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { AuthApi } from "@/util/api";
import { useRecoilState } from "recoil";
import { userInfo } from "@/atom/user";
import { useQuery } from "react-query";

export default function Logout() {
  const [user, setUser] = useRecoilState(userInfo)
  const router = useRouter();
  const logout = useQuery("logout", async () => {
    const request = await AuthApi.post("/logout-proc");
    if (request) {
      Cookies.remove("autoLogin");
      Cookies.remove("accessToken");
      Cookies.remove("socialLogin");
      setUser({
        username: "",
        nickname: "",
        expires: new Date(),
      })
      router.push("/");
    }
  })

  if(logout.isLoading) return <></>;
}

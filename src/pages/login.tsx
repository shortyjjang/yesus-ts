import { userInfo } from "@/atom/user"
import Button from "@/layout/button"
import Confirm from "@/layout/confirm"
import InputText from "@/components/input/text"
import PageTitle from "@/components/page_title"
import Auth from "@/layout/auth"
import Container from "@/layout/container"
import { AuthApi } from "@/util/api"
import dayjs from "dayjs"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSetRecoilState } from "recoil"

type loginData = {
  username: string
  password: string
}

export default function Login() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
    }
  })
  const setUser = useSetRecoilState(userInfo)
  const [alert, setAlert] = useState<string | null>(null)
  const router = useRouter()
  const {returnUrl} = router.query
  const loginSubmit = async (data:loginData) => {
    const { username, password } = data;
    if (!username) {
      setAlert("아이디를 입력해주세요.");
      return;
    }
    if (!password) {
      setAlert("비밀번호를 입력해주세요.");
      return;
    }
    const body = JSON.stringify({
      username,
      password,
    });
    try {
      const response:{
        data: {
          access_token?: string,
          username?: string,
          nickname?: string,
          code?: string,
          message?: string,
        }
      } = await AuthApi.post("/form-login", body);
      if(!response) return;
      const { access_token, username, nickname, message } = response.data;
      if (message) {
        setAlert(message);
      }
      if(access_token && username) {
        setUser({
          username,
          nickname: nickname ? nickname : '',
          expires: dayjs().add(30, 'minute').toDate(),
        })
        Cookies.set('accessToken', access_token, { expires: 1/48.2 });
        router.push(returnUrl ? String(returnUrl) : '/')
      }
    } catch (e: any) {
      if (e.response.data.message)
        setAlert(e.response.data.message+'\n다시 확인하신 후 입력해주세요.');
    }
  } 
  return (
    <Auth role="GUEST">
      <PageTitle title="로그인" />
        <Container className="pb-10">
          <form
            onSubmit={handleSubmit(loginSubmit)}
          >
            <fieldset className="max-w-[400px] mx-auto">
              <legend>회원로그인</legend>
              <InputText register={register("username")} placeholder="아이디" inlineCSS="margin-bottom:2rem;" />
              <InputText type="password" register={register("password")} placeholder="비밀번호" inlineCSS="margin-bottom:2rem;" />
              <Button type="submit" styleType="secondary" className="w-full">
                로그인
              </Button>
            </fieldset>
          </form>
        </Container>
        {alert && <Confirm onClose={() => setAlert(null)}>{alert}</Confirm>}
    </Auth>
  )
}

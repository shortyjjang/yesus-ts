import { userInfo } from '@/atom/user'
import { getaccessToken } from '@/util/get_token'
import dayjs from 'dayjs'
import { get } from 'http'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'

export default function Auth({
    role = 'NON',
    children
}:{
    role?: 'NON' | 'USER' | 'GUEST'
    children: ReactNode
}) {
    const router = useRouter()
    const [user, setUser] = useRecoilState(userInfo)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const getToken = useMutation('token',async () => {
        const request:loginData= await getaccessToken()
        return request
    },{
        onSuccess: (data:loginData) => {
            setUser({
                ...data,
                expires: dayjs(data.expires).toDate()
            })
            if(role === 'USER' && data.username) {
                setIsLoading(true)
            }
            if(role === 'GUEST' && !data.username) {
                setIsLoading(true)
            }
        }
    })
    useEffect(() => {
        if(Cookies.get('accessToken') && dayjs().diff(dayjs(user.expires).add(-5, 'minute'), 'minute') > 0) {
            getToken.mutate()
        }
        if(user.username && !Cookies.get('accessToken')) {
            setUser({
                username: '',
                nickname: '',
                expires: dayjs().toDate()
            })
        }
        if(role === 'NON') {
            setIsLoading(true)
                return;
        }
        if(role === 'USER') {
            if(!user.username && Cookies.get('accessToken')) {
                getToken.mutate()
                return;
            }
            if(user.username && Cookies.get('accessToken')) {
                setIsLoading(true)
                return;
            }
            router.push('/login')
        }
        if(role === 'GUEST') {
            if(Cookies.get('accessToken')) {
                router.push('/')
                return;
            }
            setIsLoading(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <>{isLoading && children}</>
    )
}
type loginData = {
    username: string,
    nickname: string,
    expires: string,
} 
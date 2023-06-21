import { userInfo } from '@/atom/user'
import { Api, ApiResponseType } from '@/util/api'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { PostParamType } from '.'

export default function PostHeader({
    title,
    voteCount,
    score,
    createTime,
    viewCount,
    isVoted,
    createBy,
    setAlert,
    articleId,
    bbsId
}:{
    title: string,
    voteCount?: number,
    score?: number,
    createTime: string,
    viewCount?: number,
    isVoted?: boolean,
    createBy: string,
    setAlert: (msg: string) => void
    articleId: string,
    bbsId: number
}) {
    const user = useRecoilValue(userInfo)
    const [vote, setVote] = useState(isVoted)
    const onVote = useMutation(
        'vote', 		// 키
        async (data:PostParamType) => {
            const request:ApiResponseType = await Api.post(
                `/api/board/v1/vote`,data,
                {
                  headers: {
                    Authorization: Cookies.get("accessToken"),
                  },
                }
              );
              return request.content
        },
        {			// 옵션
          onError: err => { 
            setAlert('네트워크에 문제가 있어 추천을 할 수 없습니다.')
          },
          onSuccess: () => {
            setVote(!isVoted)
          },
        }
    );
  return (
    <div>
        <div>{title}</div>
        <div>{createBy}</div>
        <div>{createTime}</div>
        {viewCount && <div>조회 {viewCount}</div>}
        {voteCount && <div>추천 </div>}
        {score && <div>평점 {score}</div>}
        <button
            onClick={() => {
                if(!user.username) {
                    setAlert('로그인 후 이용해주세요.')
                    return;
                }
                const data = {
                    articleId: articleId,
                    customerMallCd: "YESUS",
                    customerUid: user.username? user.username : '',
                    managementId: bbsId,
                }
                onVote.mutate(data)
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48"><path d="M35.8 42H13.6V16.4L27.5 2l1.95 1.55q.3.25.45.7.15.45.15 1.1v.5L27.8 16.4h14.95q1.2 0 2.1.9.9.9.9 2.1v4.1q0 .35.075.725t-.075.725l-6.3 14.5q-.45 1.05-1.475 1.8Q36.95 42 35.8 42Zm-19.2-3h19.85l6.3-14.95V19.4H24.1l2.65-12.45-10.15 10.7Zm0-21.35V39Zm-3-1.25v3H6.95V39h6.65v3H3.95V16.4Z" /></svg>
            추천하기 
            <small>({voteCount})</small>
        </button>
    </div>
  )
}

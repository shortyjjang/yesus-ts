/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { userInfo } from '@/atom/user'
import { Api, ApiResponseType } from '@/util/api'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { PostParamType } from '.'
import { bbsInfoType } from '@/atom/board'
import Button from "@/layout/button"

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
    bbsId,
    thisBBSInfo,
    categoryId,
    secretYn,
    newPostYn,
    questionStatus
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
    thisBBSInfo: bbsInfoType
    categoryId?: number
    secretYn?: string
    newPostYn?: string
    questionStatus?: string
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
            setVote(!vote)
          },
        }
    );
  return (
    <div className="px-3 py-9 border-t border-b border-solid border-gray-300 relative">
        
        <div css={css`
            font-size:2.47rem;
        `}>
          {thisBBSInfo.secretUseYn === 'Y' && secretYn === "Y" && <span>비밀글</span>}
          {title}
          {newPostYn === "Y" && <span>NEW</span>}
        </div>
        <div className="flex gap-4" css={css`
          color:var(--grayColor);
          font-size:1.7rem;
          div+div:before {content:'';width: 1px;height: 1.5rem;background: var(--grayColor);display:inline-block;margin:-0.2rem 1rem 0 0;vertical-align:middle;}
        `}>
          {questionStatus === 'Y' && <div className="fcg flex items-center gap-2"><span className="w-6 aspect-square bg-contain -mt-1" css={css`
            background: url(/images/icon-confirm.svg) no-repeat 50% 50%;
          `}></span>답변완료</div>}
          {thisBBSInfo.categoryUseYn === 'Y' && categoryId && thisBBSInfo.categoryList && 
          thisBBSInfo.categoryList.findIndex(category => category.id === categoryId) > -1 && 
          <div>{thisBBSInfo.categoryList.find((category) => category.id === categoryId)?.name}</div>}
          <div>{createBy}</div>
          <div>{createTime}</div>
          {thisBBSInfo.viewCountUseYn === 'Y' && viewCount && <div>조회 {viewCount}</div>}
          {thisBBSInfo.scoreUseYn === 'Y' && voteCount && <div>추천 {voteCount}</div>}
          {thisBBSInfo.scoreUseYn === 'Y' && score && <div 
            className="flex items-center absolute right-0 top-1/2 -translate-y-1/2"
            css={css`&:before {opacity:0;}`}
          >
            <Button styleType={vote ? 'default' : 'dimmend'}
              size="sm"
              className={`flex gap-1 items-center font-normal`}
              inlineCSS={`
                padding:0.5rem 1rem;
                ${isVoted ? 'color:var(--greenColor);border-color:var(--greenColor)' : ''}
              `}
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20"><path d="M35.8 42H13.6V16.4L27.5 2l1.95 1.55q.3.25.45.7.15.45.15 1.1v.5L27.8 16.4h14.95q1.2 0 2.1.9.9.9.9 2.1v4.1q0 .35.075.725t-.075.725l-6.3 14.5q-.45 1.05-1.475 1.8Q36.95 42 35.8 42Zm-19.2-3h19.85l6.3-14.95V19.4H24.1l2.65-12.45-10.15 10.7Zm0-21.35V39Zm-3-1.25v3H6.95V39h6.65v3H3.95V16.4Z" /></svg>
                추천하기 
                <small>({voteCount})</small>
            </Button>
          </div>}
        </div>
    </div>
  )
}

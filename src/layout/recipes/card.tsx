/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import Image from "next/image";
import Link from "next/link";
import { userInfo } from "@/atom/user";
import { ReactNode, useState } from "react";
import { useRecoilValue } from "recoil";
import { useMutation } from "react-query";
import { Api, ApiResponseType } from "@/util/api";
import Cookies from "js-cookie";
export interface RecipeItemType {
    recipeId: number,
    recipeTitle: string,
    recipeRepImageUrl: string,
    recipeSummary?: string,
    recipeCookingTime: string,
    recipeDifficult: string,
    includeRecommendYn: string
}
interface RecipeCardProps extends RecipeItemType {
    setAlert: (msg:string | ReactNode) => void,
}
export default function RecipeCard({
    recipeId,
    recipeTitle,
    recipeRepImageUrl,
    recipeSummary,
    recipeCookingTime,
    recipeDifficult,
    includeRecommendYn,
    setAlert,
}:RecipeCardProps) {
    const user = useRecoilValue(userInfo)
    const [bookmark, setBookmark] = useState<boolean>(includeRecommendYn === 'Y')
    const changeBookmark = useMutation('bookmark', async (body:{
        mallCd: string,
        mallCustomerId: string,
        recipeId: number,
    }) => {
        const request:ApiResponseType = await Api.post(
            `/api/customer/v1/recipe/${!bookmark ? 'add':'remove'}BookmarkRecipe`,body, {
            headers: {
                Authorization: Cookies.get("accessToken"),
            },
        })
        return request
    },{
        onSuccess: (data) => {
            if(data.meta?.resultMsg) {
                setAlert(data.meta.resultMsg)
                return;
            }
            setBookmark(!bookmark)
        }
    })
  return (
    <>
        <div key={recipeId} className="relative">
        <Link href={`/recipes/${recipeId}`}>
            <span className="relative border border-solid block border-black" css={css`
                aspect-ratio:1/1.2;
            `}>
            <Image
                src={`${process.env.NEXT_PUBLIC_IMG_SERVER}/${recipeRepImageUrl}`}
                alt={recipeTitle}
                fill={true}
                className="absolute top-0 left-0 w-full h-full object-cover"
                priority={true}
            />
            </span>
            <span className="flex mt-3" css={css`
                font-size:1.5rem;
                small {display:flex;align-items:center;}
                b {margin-right:0.5rem;}
                small+small:before {
                    content:'';
                    margin:0 1.2rem 0;
                    width: 1px;
                    height: 1.7rem;
                    background: var(--defaultColor);
                    position:relative;
                }
            `}>
                <small>
                    <b>난이도</b> {recipeDifficult}
                </small>
                <small>
                    <b>소요시간</b> {recipeCookingTime}
                </small>
            </span>
            <strong
            className="block mt-1 mb-2 py-2"
            css={css`font-size:2.31rem;line-height:1.2;`}
            dangerouslySetInnerHTML={{ __html: recipeTitle }}
            ></strong>
            {recipeSummary && (
            <span
                className="block"
                css={css`
                font-size: 1.7rem;
                `}
                dangerouslySetInnerHTML={{ __html: recipeSummary }}
            ></span>
            )}
        </Link>
        <button
            title="북마크"
            className="absolute top-4 right-4 aspect-square w-20"
            css={css`
            background: transparent url(/images/icon-heart${bookmark ? '-on':''}.svg) no-repeat center/contain;
            `}
            onClick={() => {
            if (!user.username) {
                setAlert(<>로그인 하시겠습니까?<br />
                로그인 하시면 북마크 하실 수 있습니다</>);
                return;
            }
            changeBookmark.mutate({
                mallCd: 'YESUS',
                mallCustomerId: user.username,
                recipeId: recipeId,
            })
            }}
        ></button>
        </div>
    </>
  )
}

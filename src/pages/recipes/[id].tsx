/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Api, ApiResponseType } from "@/util/api";
import { NextSeo } from "next-seo";
import Confirm from "@/layout/confirm";
import { useRouter } from "next/router";
import Auth from "@/layout/auth";
import Cookies from "js-cookie";
import { useMutation, useQuery } from "react-query";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { userInfo } from "@/atom/user";
import { useRecoilValue } from "recoil";
import { mobileWidth } from "@/layout/header";
import { filterJson } from "@/layout/recipes/search";
import RecipeTag from "@/layout/recipes/tag";
import Container from "@/layout/container";
import RecipeIngredients, { RecipeIngredientsType } from "@/layout/recipes/ingredients";
import RecipeComment, { commentType } from "@/layout/recipes/comment";

export default function RecipeDetail() {
    const router = useRouter()
    const { id } = router.query
    const user = useRecoilValue(userInfo)
    const [alert, setShowAlert] = useState<ReactNode | null>(null)
    const {data:post, refetch, isError} = useQuery(['recipeDetail', id], async () => {
        if(!id) return;
        const request:ApiResponseType = await Api.get(`/api/v1/recipe/detail/${id}`, {
          headers: {
            Authorization: Cookies.get("accessToken"),
          },
        });
        const data:RecipeDetailType = request.content
        return data
    })
    const changeBookmark = useMutation('bookmark', async (body:{
        mallCd: string,
        mallCustomerId: string,
        recipeId: number,
    }) => {
        const request:ApiResponseType = await Api.post(
            `/api/customer/v1/recipe/${post?.includeBookmarkYn ? 'remove':'add'}BookmarkRecipe`,body, {
            headers: {
                Authorization: Cookies.get("accessToken"),
            },
        })
        return request
    },{
        onSuccess: (data) => {
            if(data.meta?.resultMsg) {
                setShowAlert(<Confirm onClose={() => {
                    setShowAlert(null);
                    router.back()
                }}>{data.meta.resultMsg}</Confirm>)
                return;
            }
            refetch()
        }
    })
    if(!post) return (<Confirm onClose={() => router.push('/recipes')}>존재하지 않는 레시피입니다.</Confirm>)
    return (
        <Auth role="NON">
            <NextSeo
                title={`${post.recipeTitle ? post.recipeTitle : "유기농, 못난이 농산물"} - 예스어스`}
                description={post.recipeSummary}
                canonical={`${process.env.NEXT_PUBLIC_URL}/product/${post.recipeId}`}
                openGraph={{
                    url: `${process.env.NEXT_PUBLIC_URL}/recipes/${post.recipeId}`,
                    title: `${post.recipeTitle ? post.recipeTitle : "예스어스 레시피"} - 예스어스`,
                    description: post.recipeSummary,
                    images: [{
                        url: `${process.env.NEXT_PUBLIC_IMG_SERVER}/${post.recipeRepImageUrl}`,
                        width: 600,
                        height: 600,
                        alt: `${post.recipeTitle ? post.recipeTitle : "예스어스 레시피"} - 예스어스`,
                        type: 'image/jpeg',
                      }],
                    siteName: '예스어스',
                }}
            />
            <Container inlineCSS={`
                @media(min-width: ${mobileWidth}px) {
                    display:grid;
                    grid-template-columns: repeat(2,1fr);
                    grid-gap: 3.75rem;
                    padding-top:12.5rem;
                }
            `}>
                <div className="relative border border-solid border-black w-full -mx-10" css={css`
                    aspect-ratio:1/1.3;border-width:0 0 1px;width:calc(100% + 5rem);
                    @media(min-width: ${mobileWidth}px) {
                        border-width:1px;margin:0;width:100%;
                    }
                `}>
                    <Image
                    src={
                        post.recipeRepImageUrl
                        ? `${process.env.NEXT_PUBLIC_IMG_SERVER}/${post.recipeRepImageUrl}`
                        : "/images/blank.gif"
                    }
                    fill
                    className="object-cover"
                    alt={
                        post.recipeTitle
                        ? post.recipeTitle
                        : "예스어스 레시피"
                    }
                    />
                    <button
                      title="북마크"
                      className="absolute top-8 right-8 aspect-square w-20"
                      css={css`
                        background: transparent url(/images/icon-heart${post.includeBookmarkYn ? '-on':''}.svg) no-repeat center/contain;
                      `}
                      onClick={() => {
                        if (!user.username) {
                          setShowAlert(
                            <Confirm
                              onClose={() => setShowAlert(null)}
                              onSuccess={() =>
                                router.push(
                                  `/login?returnUrl=/recipes${
                                    router.query.id ? `/${router.query.id}` : ""
                                  }`
                                )
                              }
                            >
                                로그인 하시겠습니까?<br />
                                로그인 하시면 북마크 하실 수 있습니다
                            </Confirm>
                          );
                          return;
                        }
                        changeBookmark.mutate({
                            mallCd: 'YESUS',
                            mallCustomerId: user.username,
                            recipeId: post.recipeId,
                        })
                      }}
                    ></button>
                </div>
                <div className="pt-8 pb-48 w-full" css={css`
                    @media(min-width: ${mobileWidth}px) {
                        padding-top:0;
                    }
                `}>
                    {filterJson.map(filter => 
                        <RecipeTag key={filter.name} 
                            {...filter}
                            tags={
                            (filter.name === 'kindCodeList' && post.recipeKind) ? post.recipeKind.split(',')
                            : (filter.name === 'difficultyCodeList' && post.recipeDifficult) ? post.recipeDifficult.split(',')
                            : (filter.name === 'situationCodeList' && post.recipeSituation) ?  post.recipeSituation.split(',')
                            : (filter.name === 'timeCodeList' && post.recipeCookingTime) ?  post.recipeCookingTime.split(',')
                            :[]
                        } />
                    )}
                    <h2 className="font-extrabold pt-4"
                        css={css`font-size:4rem;line-height:1.2;`}
                        dangerouslySetInnerHTML={{ __html: post.recipeTitle }}
                    ></h2>
                    <p className="font-extrabold pt-2">{post.recipeSummary}</p>
                    <p className="grid gap-2 py-10" css={css`
                        grid-template-columns: 30% auto;
                        font-size:var(--defaultSpace);
                    `}>
                        <span>난이도</span> 
                        <b className="font-bold">{post.recipeDifficult}</b>
                        <span>조리시간</span> 
                        <b className="font-bold">{post.recipeCookingTime}</b>
                    </p>
                    <RecipeIngredients defaultCount={post.recipeUnitCount} 
                        recipeUnit={post.recipeUnit}
                        ingredients={post.ingredients.map(item => ({
                            ...item,
                            items: item.items.map(it => ({
                                ...it,
                                count: (it.count / post.recipeUnitCount)
                            }))
                        }))} 
                    />
                    <dl className="py-14 border-t border-solid border-black" css={css`
                        font-size:2.5rem;
                    `}>
                        <dt className="font-extrabold py-2" css={css`
                            font-size:3rem;
                        `}>레시피</dt>
                        <dd
                        dangerouslySetInnerHTML={{ __html: post.recipeDescHtml }}
                        ></dd>
                    </dl>
                </div>
            </Container>
            <hr className="border-0 h-px bg-gray-300 w-ful mb-48" />
            <Container className="pb-20">
                <h3 className="font-extrabold" css={css`
                    font-size: 2.875rem;
                `}>
                이번 <b className="fcg">레시피</b>는 어떠셨나요?
                </h3>
                <RecipeComment recipeId={post.recipeId} commentList={post.scoreList} setAlert={(msg) => setShowAlert(
                    <Confirm onClose={() => setShowAlert(null)}>{msg}</Confirm>
                )} refetch={refetch} />
            </Container>
            {alert && alert}
        </Auth>
    )
}

 
type RecipeDetailType = {
    "recipeId": number,
    "recipeTitle": string,
    "recipeRepImageUrl": string,
    "recipeSummary": string,
    "recipeDescHtml": string,
    "ingredients": RecipeIngredientsType[]
    "recipeCookingTime": string,
    "recipeDifficult": string,
    "recipeKind": string,
    "recipeSituation": string,
    "recipeVideoUrl": string,
    "includeBookmarkYn": false,
    "includeRecommendYn": false,
    "recipeUnit": "인분",
    "recipeUnitCount": number,
    "scoreList": commentType[]
}
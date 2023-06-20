/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { Swiper, SwiperSlide } from 'swiper/react'
import RecipeCard, { RecipeItemType } from './card'
import PageTitle from '@/components/page_title'
import Cookies from "js-cookie"
import { Api, ApiResponseType } from "@/util/api"
import { useRecoilValue } from "recoil"
import { userInfo } from "@/atom/user"
import { useQuery } from "react-query"

import 'swiper/css'
import Confirm from "@/components/confirm"
import { useState } from "react"

export default function TagRecipeList({
    tagIds
}:{
    tagIds: string
}) {
    const [alert, setAlert] = useState<string | null>(null)
    const user = useRecoilValue(userInfo)
    const recipes = useQuery(['recipes', user.username], 
    async () => {
        return await getRecipes(tagIds,user.username)
    })
    if(!recipes.data) return <></>
    return (
        <section className="my-20">
            <PageTitle title="예스어스 레시피" inlineCSS="text-align:left;padding:0 2.5rem 2rem;" />
            
            <Swiper
                slidesPerView={2.3}
                spaceBetween={10}
                breakpoints={{
                    720: {
                        slidesPerView: 5.3,
                        spaceBetween: 30,
                    }
                }}
                freeMode={true}
                css={css`
                padding:0 2.5rem;
                `}
            >
                {recipes.data.content.recipes.map((recipe:RecipeItemType) => (
                    <SwiperSlide key={recipe.recipeId}><RecipeCard {...recipe} setAlert={setAlert} /></SwiperSlide> 
                ))}
            </Swiper>
            {alert && <Confirm onClose={() => setAlert(null)}>
                {alert}
            </Confirm>}
        </section>
    )
}

type recipeRequestType = {
    params: {
        itemTagId: string,
        recipeCount: number,
        mallCd: string,
        mallCustomerId?: string,
    }
    headers: {
        Authorization: string | null
    }
}
async function getRecipes(tagId:string, username:string) {
    let payload:recipeRequestType = {
        params: {
            itemTagId: tagId,
            recipeCount: 8,
            mallCd: "YESUS",
        },
        headers: {
          Authorization: null,
        },
    }
    if(username && Cookies.get("accessToken")) payload = {
        params: {
            ...payload.params,
            mallCustomerId: username,
        },
        headers: {
          Authorization: String(Cookies.get("accessToken"))
        },
    }
    const request:ApiResponseType = await Api.get("/api/v1/recipe/productByItemTag", payload)
    return request
}
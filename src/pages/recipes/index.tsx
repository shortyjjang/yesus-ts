/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { userInfo } from '@/atom/user';
import Confirm from '@/layout/confirm';
import PageTitle from '@/components/page_title';
import RecipeCard, { RecipeItemType } from '@/layout/recipes/card';
import { Api, ApiResponseType } from '@/util/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react'
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import Container from '@/layout/container';
import { mobileWidth } from '@/layout/header';
import RecipeSearch from '@/layout/recipes/search';
import Auth from '@/layout/auth';

export default function Recipes() {
    const user = useRecoilValue(userInfo)
    const [alert, setAlert] = useState<ReactNode | null>(null);
    const router = useRouter()
    const {data:list, isError, isLoading, refetch} = useQuery(['recipes_list', router.query], async () => {
        let body:RecipesParamType = {
            mallCd: 'YESUS',
            pageIndex: 1,
            pageSize: 20,
            sort: "title",
        }
        if(Object.keys(router.query).length > 0) {
            Object.keys(router.query).map((key) => {
                if(key === 'kind' || key === 'difficulty' || key === 'situation' || key === 'time') {
                    body = {
                        ...body,
                        param: {
                            ...body.param,
                            [`${key}CodeList`]: String(router.query[key]).split(',')
                        }
                    }
                }else {
                    let name = key
                    if(key === 'keyword') name = 'searchValue'
                    if(key === 'page') name = 'pageIndex'
                    body = {
                        ...body,
                        [key]: String(router.query[key])
                    }
                    if(key === 'keyword') {
                        body = {
                            ...body,
                            param: {
                                ...body.param,
                                searchVal: String(router.query[key])
                            }
                        }
                    }
                }
            })
        }
        if(user.username) {
            body = {
                ...body,
                mallCustomerId: user.username
            }
        }
        const request:ApiResponseType = await Api.post("/api/v1/recipe/listV2", body, {
            headers: {
                Authorization:
                Cookies.get("accessToken") && user.username
                    ? Cookies.get("accessToken")
                    : null,
            },
            });
            if (request?.meta?.resultMsg) {
                setAlert(<Confirm onClose={() => setAlert(null)}>{request.meta.resultMsg}</Confirm>)
                return;
            }
            return request.content
        }
    )
  return (
    <Auth role='NON'>
    <Container>
        <PageTitle title="예스어스 레시피" />
        <RecipeSearch refetch={refetch} />
        {(isError || isLoading) ?
            <p className='text-center py-40 text-gray-500'>죄송합니다.<br />레시피를 준비중입니다.</p>
        : list && <div className='py-20'>
            <div className='pb-5'>총 <b className='fcg'>{list.totalCount}</b>개의 레시피</div>
            {list.recipeList.length > 0 ? <div className='grid grid-cols-2 gap-8' css={css`
                @media screen and (min-width: ${mobileWidth}px) {
                    grid-template-columns: repeat(3, 1fr);
                }
                @media screen and (min-width: 1200px) {
                    grid-template-columns: repeat(4, 1fr);
                }
            `}>
                {list.recipeList.map((recipe:RecipeItemType) => (
                    <RecipeCard {...recipe} key={recipe.recipeId} setAlert={setAlert}/>
                ))}
            </div>
            : <p className='text-center py-40 text-gray-500'>죄송합니다.<br />레시피를 준비중입니다.</p>}
        </div>}
        
        {alert && alert}
    </Container>
    </Auth>
  )
}

export type RecipesParamType = {
    itemTagId?: string,
    mallCd: string,
    mallCustomerId?: string,
    pageIndex: number,
    pageSize: number,
    param?: {
      difficultyCodeList?: string[],
      kindCodeList?: string[],
      searchVal?: string,
      situationCodeList?: string[],
      timeCodeList?: string[]
    },
    searchValue?: string,
    sort: string
  }
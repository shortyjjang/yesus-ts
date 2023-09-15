/** @jsxImportSource @emotion/react */

import { bbsInfo } from "@/atom/board"
import { userInfo } from "@/atom/user"
import { Api, ApiResponseType } from "@/util/api"
import { css } from "@emotion/react"
import Link from "next/link"
import { useState } from "react"
import {  useQuery } from "react-query"
import { useRecoilValue } from "recoil"
import { bbsName } from "@/layout/board"
import Accordion from "@/layout/board/list/accordion"
import ListItem from "@/layout/board/list/item"
import Select from "@/components/input/select"
import { useRouter } from "next/router"
import SearchBoard from "./search"
import dayjs from "dayjs"
import Pagination from "./pagination"
import Button from "@/layout/button"

export default function BoardList({ 
    bbsId,
    setAlert,
    query,
    productId
}:{
    bbsId: number
    productId?: string
    setAlert: (msg: string) => void
    query: BoardParamType
}) {
    const router = useRouter()
    const user = useRecoilValue(userInfo)
    const boardInfo = useRecoilValue(bbsInfo)
    const thisBBSInfo = boardInfo.find((bbs) => bbs.id === bbsId)
    const [params, setParams] = useState<BoardParamType>(query)
    const [categoryId, setCategoryId] = useState('all')
    const bbsList = useQuery(['bbsList', params], async () => {
        const request:ApiResponseType = await Api.post("/api/board/v1", params);
        if(request?.meta?.resultMsg) {
            setAlert(request.meta.resultMsg)
            return;
        }
        const data:BoardListType = request.content
        return data
    })
    const search = (value:any[][]) => {
        if(!router.query) return;
        let newQuery:BoardQueryType= router.query
        let newParams:BoardParamType = params
        if(value.findIndex((item) => item[0] === 'title+contents') < 0) {
            if(value.findIndex((item) => item[0] === 'title') < 0){
                delete newQuery['title']
                delete newParams['title']
            }
            if(value.findIndex((item) => item[0] === 'contents') < 0){
                delete newQuery['contents']
                delete newParams['contents']
            }
        }
        value.forEach((item) => {
            if((item[1] === 'all' || item[1] === '' || (item[0] === 'page' && item[1] === '1')) && item[0]) {
                if(item[0] === 'categoryId') {
                    delete newQuery['categoryId']
                    delete newParams['categoryId']
                }
                if(item[0] === 'page' && item[1] === '1') {
                    delete newQuery['page']
                    newParams.page = 1
                }
                if(item[0] === 'endDate') {
                    delete newQuery['endDate']
                    delete newParams['endDate']
                    delete newParams['startDate']
                }
            }else {
                newQuery = {
                    ...newQuery,
                    [item[0]]: item[1]
                }
                newParams = {
                    ...newParams,
                    [item[0]]: item[1]
                }
                if(item[0] === 'endDate') newParams = {
                    ...newParams,
                    startDate: dayjs().format('YYYY-MM-DD hh:mm:ss'),
                }
            }
        })
        setParams(newParams)
        router.push({
            pathname: router.pathname,
            query: newQuery
        }, undefined, {scroll: false})
    }
    if(bbsList.data && thisBBSInfo) return (<>
        {!productId && thisBBSInfo.categoryUseYn === 'Y' && thisBBSInfo.categoryList.length > 0 && (
            <div className="text-right pb-8"><Select 
                options={[['전체','all'],...thisBBSInfo.categoryList.map(category => [category.name, String(category.id)])]}
                setValue={(e) => {
                    setCategoryId(e.target.value)
                    search([['categoryId', e.target.value]])
                }}
                value={categoryId}
                size="large"
            /></div>
        )}
        <div className={thisBBSInfo.markType === 'GALLARY' ?'grid grid-cols-2 gap-6':'border-t border-solid'} css={css`
            border-color:var(--lightGrayColor);
        `}>
            {bbsList.data.content && bbsList.data.content.length > 0 ? 
                bbsList.data.content.map((item) => (
                    (thisBBSInfo.markType === 'ACCORDION' || productId)
                    ? <Accordion
                        setAlert={setAlert} 
                        item={item} 
                        thisBBSInfo={thisBBSInfo} 
                        key={item.articleId} 
                    />
                    : <Link key={item.articleId} href={`/${bbsName(bbsId)}/${item.articleId}`}
                        className={`cursor-pointer
                        ${thisBBSInfo.useProductYn === 'Y' ? 'grid':'block'}
                        ${thisBBSInfo.markType === 'LIST' ? 'border-b border-solid p-4':''}
                        ${(item.notificationYn === 'Y' && thisBBSInfo.markType === 'LIST') ? 'bg-white':''}
                    `} css={css`
                        ${thisBBSInfo.markType === 'LIST' ? 'border-color:var(--lightGrayColor);':''}
                        ${thisBBSInfo.useProductYn === 'Y' ? 'grid-template-columns:7rem auto;':''}
                    `}>
                        <ListItem {...item} thisBBSInfo={thisBBSInfo} />
                    </Link>
                ))
            : <div className="text-center py-40 border-b border-solid" css={css`
                border-color:var(--lightGrayColor);
            `}>게시글이 없습니다.</div>}
        </div>
        {bbsList.data.content && bbsList.data.content.length > 0 && <Pagination search={search} totalPagesCount={bbsList.data.totalPagesCount} currentPage={bbsList.data.currentPage} />}
        {thisBBSInfo.writeRole === 'NON' || (thisBBSInfo.writeRole === 'USER' && user.username) 
        && <Button onClick={() => router.push(`/${bbsName(thisBBSInfo.id)}/write${productId ?`?productId=${productId}` :''}`)} className="w-full mb-8">글쓰기</Button>}
        {!productId && bbsList.data.content && bbsList.data.content.length > 0 && <SearchBoard search={search}
            defaultSearchType={Object.keys(router.query).find((key) => key === 'contents') && Object.keys(router.query).find((key) => key === 'title') 
                ? 'title+contents' : (Object.keys(router.query).find((key) => key === 'contents') ? 'contents':'title')}
            defaultDate={params.endDate ? params.endDate : 'all'}
            defaultKeyword={params.title || params.contents || ''} 
        />}
    </>)
}

export interface BoardListItemType {
    articleId: string,
    managementId: number,
    title: string,
    viewCount?: number,
    score?: number,
    voteCount?: number,
    secretYn?: string,
    createBy: string,
    createTime: string,
    notificationYn?: string,
    newPostYn?: string,
    productId?: string,
    productImage?: string,
    productName?: string,
    orderProductId?: string
    contents?: string
    thumbnailImage?: string
    categoryId?: number
    questionStatus?: string
}

export type BoardListType = {
    content : BoardListItemType[],
    currentPage: number,
    pageSize: number,
    totalCount: number,
    totalPagesCount: number
}

export type BoardParamType = {
    page: number,
    rows: number,
    managementId: number,
    registerId?: string,
    productId?: string,
    categoryId?: string,
    startDate?: string,
    endDate?: string,
    title?: string,
    contents?: string,
}

export type BoardQueryType = {
    page?: string,
    registerId?: string,
    productId?: string,
    categoryId?: string,
    contents?: string,
    endDate?: string,
    title?: string,
}
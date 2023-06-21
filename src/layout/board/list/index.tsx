/** @jsxImportSource @emotion/react */

import { bbsInfo, bbsInfoType } from "@/atom/board"
import { userInfo } from "@/atom/user"
import PageTitle from "@/components/page_title"
import { Api, ApiResponseType } from "@/util/api"
import { css } from "@emotion/react"
import Image from "next/image"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { useMutation, useQuery } from "react-query"
import { useRecoilState, useRecoilValue } from "recoil"
import { bbsName } from ".."
import Post from "@/layout/board/post"
import Accordion from "@/layout/board/list/accordion"
import ListItem from "@/layout/board/list/item"

export default function BoardList({ 
    bbsId,
    productId,
    setAlert
}:{
    bbsId: number
    productId?: number
    setAlert: (msg: string) => void
}) {
    const user = useRecoilValue(userInfo)
    const boardInfo = useRecoilValue(bbsInfo)
    const thisBBSInfo = boardInfo.find((bbs) => bbs.id === bbsId)
    const [params, setParams] = useState(
        bbsId === 3 ?
        {
            page: 1,
            rows: 20,
            managementId: bbsId,
            registerId: user?.username ? user?.username : '',
        }:( productId ? {
            page: 1,
            rows: 20,
            managementId: bbsId,
            productId: productId,
        }:{
            page: 1,
            rows: 20,
            managementId: bbsId,
        })
    )
    const bbsList = useQuery(['bbsList', params], async () => {
        const request:ApiResponseType = await Api.post("/api/board/v1", params);
        if(request?.meta?.resultMsg) {
            setAlert(request.meta.resultMsg)
            return;
        }
        const data:BoardListType = request.content
        return data
    })
    if(bbsList.data && thisBBSInfo) return (
        <>
            <PageTitle title={thisBBSInfo.name} />
            {bbsList.data.content && bbsList.data.content.length > 0 && 
                bbsList.data.content.map((item) => (
                    thisBBSInfo.markType === 'ACCORDION' 
                    ? <Accordion
                        setAlert={setAlert} 
                        item={item} 
                        thisBBSInfo={thisBBSInfo} 
                        key={item.articleId} 
                    />
                    : <Link key={item.articleId} href={`/${bbsName(bbsId)}/item.articleId`}>
                        <ListItem {...item} thisBBSInfo={thisBBSInfo} />
                    </Link>
                ))
            }
        </>
    )
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
}

export type BoardListType = {
    content : BoardListItemType[],
    currentPage: number,
    pageSize: number,
    totalCount: number,
    totalPageCount: number
}
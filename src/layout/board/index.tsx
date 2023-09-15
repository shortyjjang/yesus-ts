/** @jsxImportSource @emotion/react */

import { bbsInfo, bbsInfoType } from "@/atom/board"
import Confirm from "@/layout/confirm"
import { Api, ApiResponseType } from "@/util/api"
import { css } from "@emotion/react"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useRecoilState, useRecoilValue } from "recoil"
import Container from "@/layout/container"
import BoardList from "@/layout/board/list"
import { useRouter } from "next/router"
import Post from "./post"
import PageTitle from "@/components/page_title"
import AddPost from "./post/add"
import EditPost from "./post/edit"
import { userInfo } from "@/atom/user"
import Auth from "../auth"


export default function Board({ 
    bbsId, 
    type,
    productId
}:{
    bbsId: number
    type:string,
    productId?: string
}) {
    const router = useRouter()
    const {id} = router.query
    const user = useRecoilValue(userInfo)
    const [boardInfo, setBoardInfo] = useRecoilState(bbsInfo)
    const [alert, setAlert] = useState<string | null>(null)
    const thisBBSInfo = boardInfo.find((bbs) => bbs.id === bbsId)
    const {data:getBoardInfo} = useQuery(['boardInfo', bbsId], async () => {
        if(boardInfo.findIndex((bbs) => bbs.id === bbsId) > -1) return;
        const request:ApiResponseType = await Api.get(`/api/board/v1/management/${bbsId}`);
        if(request?.meta?.resultMsg) {
            setAlert(request.meta.resultMsg)
            
            return;
        }
        const data: bbsInfoType = request.content
        setBoardInfo([...boardInfo, data])
        if((data.writeRole !== 'NON' && !user.username && (type === 'edit' || type === 'write')) 
        || (data.readRole !== 'NON' && !user.username && type === 'view'))router.back()
        return data
    })
    const bbsParam = {
        page: router.query.page ? Number(router.query.page): 1,
        rows: 20,
        managementId: bbsId,
    }
    return (
        <Container className="pb-20">
            {thisBBSInfo !== undefined && <Auth role={
                (type === 'write' || type === 'edit') ? ((thisBBSInfo.writeRole === 'NON') ? 'NON': 'USER')
                : (type === 'view') ? ((thisBBSInfo.readRole === 'NON') ? 'NON':'USER')
                : ((thisBBSInfo.id === 3) ?'USER':'NON')
            }>
                {!(productId && type === 'list') &&<PageTitle title={thisBBSInfo.name} />}
                {type === 'list' && 
                    <BoardList bbsId={bbsId} setAlert={setAlert} query={
                    router.query.categoryId ? {
                        ...bbsParam,
                        categoryId: router.query.categoryId ? String(router.query.categoryId) : undefined,
                    }: bbsId === 3 ?{
                        ...bbsParam,
                        registerId: user.username
                    }: productId ? {
                        ...bbsParam,
                        productId: productId
                    }:bbsParam} productId={productId} />
                }
                {type === 'view' && id &&
                    <Post bbsId={bbsId} articleId={String(id)} thisBBSInfo={thisBBSInfo} />
                }
                {type === 'write' &&
                    <AddPost thisBBSInfo={thisBBSInfo} productId={String(router.query.productId)} />
                }
                {type === 'edit' && id &&
                    <EditPost articleId={String(id)} thisBBSInfo={thisBBSInfo} />
                }
            </Auth>}
            {alert && <Confirm onClose={() => {
                setAlert(null)
                type === 'list' ? router.push('/')
                : router.push(`/${bbsName(bbsId)}`)
            }}>{alert}</Confirm>}
        </Container>
    )
}

export const bbsName = (id:number) => {
    switch(id) {
        case 1: return 'notice';
        case 2: return 'review';
        case 3: return 'qna';
        case 4: return 'faq';
        case 5: return 'blog';
        case 6: return 'product_qa';
        case 7: return 'esg';
        default: return;
    }
}
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { bbsInfoType } from "@/atom/board"
import Image from "next/image"
import { BoardListItemType } from "@/layout/board/list"

const ListItem = ({
    articleId,
    managementId,
    title,
    viewCount,
    score,
    voteCount,
    secretYn,
    createBy,
    createTime,
    notificationYn,
    newPostYn,
    productId,
    productImage,
    productName,
    orderProductId,
    thisBBSInfo,
    contents,
    thumbnailImage,
    categoryId,
    questionStatus
}:BoardListItemsType) => {
    return (
        <>
            {
            (thisBBSInfo.fileUploadUseYn === 'Y' && thisBBSInfo.markType === 'GALLARY' && thumbnailImage) 
            || 
            (thisBBSInfo.useProductYn === 'Y' && productImage) && 
                <div className="relative w-24" css={css`grid-row:1/3;`}><Image 
                    className="absolute top-0 left-0 w-full h-full object-cover" 
                    fill={true} priority={true} 
                    src={thisBBSInfo.fileUploadUseYn === 'Y' && thisBBSInfo.markType === 'GALLARY' && thumbnailImage ? thumbnailImage:productImage} alt={title} 
                /></div>
            }
            <div className={notificationYn === 'Y' ? 'font-bold' :''} css={css`
                font-size:2.2rem;
            `}>
                {thisBBSInfo.secretUseYn === 'Y' && secretYn === "Y" && <span>비밀글</span>}
                {title}
                {newPostYn === "Y" && <span className="inline-block align-middle font-bold bcy uppercase px-2 pt-1 -mt-1 ml-2" css={css`
                    font-size:0.9rem;
                `}>NEW</span>}
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
                {thisBBSInfo.scoreUseYn === 'Y' && score && <div>평점{" "}
                    {score === 1 && '★☆☆☆☆'}
                    {score === 2 && '★★☆☆☆'}
                    {score === 3 && '★★★☆☆'}
                    {score === 4 && '★★★★☆'}
                    {score === 5 && '★★★★★'}
                </div>}
            </div>
            {thisBBSInfo.listContentsMarkUseYn === "Y" && contents && <div className="block line-clamp-2 text-ellipsis pt-2" css={css`
                font-size: 1.86rem;
                color: var(--grayColor);
                line-height: 1.4em;
                max-height: 2.8em;
                * {display:inline;}
            ${(
                (thisBBSInfo.fileUploadUseYn === 'Y' && thisBBSInfo.markType === 'GALLARY' && thumbnailImage) 
                || 
                (thisBBSInfo.useProductYn === 'Y' && productImage)
            ) ? 'grid-column:1/3':''}`} dangerouslySetInnerHTML={{__html:contents}}></div>}
        </>
    )
}

export default ListItem

export interface BoardListItemsType extends BoardListItemType {
    thisBBSInfo: bbsInfoType
}
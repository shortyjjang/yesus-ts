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
    thumbnailImage
}:BoardListItemsType) => {
    return (
        <>
            {thisBBSInfo.fileUploadUseYn === 'Y' && thisBBSInfo.markType === 'GALLARY' && thumbnailImage ?
                <div className="relative"><Image 
                    className="absolute top-0 left-0 w-full h-full object-cover" 
                    fill={true} priority={true} 
                    src={thumbnailImage} alt={title} 
                /></div>
            : thisBBSInfo.useProductYn === 'Y' && productImage && 
                <div className="relative"><Image 
                    className="absolute top-0 left-0 w-full h-full object-cover" 
                    fill={true} priority={true} 
                    src={productImage} alt={title} 
                /></div>
            }
            <div>
                {thisBBSInfo.secretUseYn === 'Y' && secretYn === "Y" && <span>비밀글</span>}
                {title}
                {newPostYn === "Y" && <span>NEW</span>}
            </div>
            <div>{createBy}</div>
            <div>{createTime}</div>
            {thisBBSInfo.viewCountUseYn === 'Y' && viewCount && <div>조회 {viewCount}</div>}
            {thisBBSInfo.scoreUseYn === 'Y' && voteCount && <div>추천 {voteCount}</div>}
            {thisBBSInfo.scoreUseYn === 'Y' && score && <div>평점 {score}</div>}
            {thisBBSInfo.listContentsMarkUseYn === "Y" && contents && <div>{contents}</div>}
        </>
    )
}

export default ListItem

export interface BoardListItemsType extends BoardListItemType {
    thisBBSInfo: bbsInfoType
}
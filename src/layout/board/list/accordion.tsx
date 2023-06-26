/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { bbsInfoType } from "@/atom/board"
import { BoardListItemType } from "@/layout/board/list"
import { useState } from "react"
import Post from "@/layout/board/post"
import ListItem from "@/layout/board/list/item"

const Accordion = ({
    item,
    thisBBSInfo,
    setAlert
}:{
    item: BoardListItemType,
    thisBBSInfo: bbsInfoType,
    setAlert: (msg: string) => void
}) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <div onClick={() => setOpen(!open)}>
                <div className={`cursor-pointer border-b border-solid p-4 relative
                    ${thisBBSInfo.useProductYn === 'Y' ? 'grid':'block'}
                    ${item.notificationYn === 'Y' ? 'bg-white':''}
                `} css={css`
                    border-color:var(--lightGrayColor);
                    ${thisBBSInfo.useProductYn === 'Y' ? 'grid-template-columns:7rem auto;':''}
                `}>
                    <div className="absolute top-1/2 right-6 w-10 h-10 bg-no-repeat -mt-5 bg-contain" css={css`
                        background-image:url('/images/icon-arrow-down.svg');
                        ${open ? 'transform:rotate(180deg);':''}
                    `}></div>
                    <ListItem {...item} thisBBSInfo={thisBBSInfo} />
                </div>
                {open && <Post articleId={item.articleId} setAlert={setAlert} bbsId={thisBBSInfo.id} thisBBSInfo={thisBBSInfo} />}
            </div>
        </>
    )
}

export default Accordion
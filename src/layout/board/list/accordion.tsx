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
                <ListItem {...item} thisBBSInfo={thisBBSInfo} />
                {open && <Post articleId={item.articleId} setAlert={setAlert} bbsId={thisBBSInfo.id} thisBBSInfo={thisBBSInfo} />}
            </div>
        </>
    )
}

export default Accordion
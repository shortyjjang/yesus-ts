import dayjs from 'dayjs'
import AddComment from './add'
import { useState } from 'react'

export default function CommentItem({
    id,
    createBy,
    createTime,
    contents,
    isEditable,
    loop,
    articleId,
    bbsId,
    setAlert
}:{
    id: number
    createBy: string
    createTime: string
    contents: string
    isEditable?: boolean
    loop: boolean
    articleId: string
    bbsId: number
    setAlert: (msg: string) => void
}) {
    const [add, setAdd] = useState(false)
    return (
        <div key={id}>
            <b>{createBy}</b>{" "}
            <span className="date">{returnTime(createTime)}</span>
            <div
            className="dialog"
            dangerouslySetInnerHTML={{
                __html: contents.replaceAll("\n", "<br />"),
            }}
            ></div>
            <div className="btns">
            {loop && (
                <button className="add" onClick={() => setAdd(!add)}>
                댓글 남기기
                </button>
            )}
            {isEditable && (
                <>
                <button
                    className="edit"
                    onClick={() => {}}
                >
                    수정
                </button>
                </>
            )}
            {add && (
                <AddComment articleId={articleId} bbsId={bbsId} setAlert={setAlert} id={id} />
            )}
            </div>
        </div>
    )
}

const returnTime = (time:string) => {
    const now = dayjs();
    const updated = dayjs(time);
    if (now.diff(updated, "years") > 0)
      return `${dayjs(time).format("YYYY-MM-DD")}`;
    else if (now.diff(updated, "months") > 0)
      return `${now.diff(updated, "months")}달전`;
    else if (now.diff(updated, "days") > 0)
      return `${now.diff(updated, "days")}일전`;
    else if (now.diff(updated, "hours") > 0)
      return `${now.diff(updated, "hours")}시간전`;
    else if (now.diff(updated, "minutes") < 10) return `방금전`;
    else return `${String(now.diff(updated, "minutes")).substring(0, 1)}0분전`;
};
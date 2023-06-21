import { userInfo } from '@/atom/user'
import { useRecoilValue } from 'recoil'
import AddComment from './add'
import CommentItem from './list'

export default function CommentIndex({
    commentList,
    loop,
    articleId,
    bbsId,
    setAlert
}:{
    commentList: commentType[]
    loop:boolean,
    articleId: string
    bbsId: number
    setAlert: (msg: string) => void
}) {
    const user = useRecoilValue(userInfo)
    return (
        <div>
            {!user.username || commentList.findIndex(comment => comment.createBy === user.username) < 0 && (
                <AddComment articleId={articleId} bbsId={bbsId} setAlert={setAlert} />
            )}
            {commentList.map(comment => (
                <CommentItem key={comment.id} {...comment} loop={loop} articleId={articleId} bbsId={bbsId} setAlert={setAlert}/>
            ))}
        </div>
    )
}
type commentType = {
    articleId: number
    contents:string
    createBy:string
    createTime:string
    id:number
    isEditable:	boolean
    managementId: number  
    parentId: number  
}
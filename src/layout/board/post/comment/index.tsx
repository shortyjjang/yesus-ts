import { userInfo } from '@/atom/user'
import { useRecoilValue } from 'recoil'
import AddComment from './add'
import CommentItem from './list'

export default function CommentIndex({
    commentList,
    loop,
    articleId,
    bbsId,
    setAlert,
    refetch
}:{
    commentList: commentType[]
    loop:boolean,
    articleId: string
    bbsId: number
    setAlert: (msg: string) => void
    refetch: () => void
}) {
    const user = useRecoilValue(userInfo)
    return (
        <div  className={"mt-20"}>
            {!user.username || commentList.findIndex(comment => comment.createBy === user.username) < 0 && (
                <AddComment refetch={refetch} articleId={articleId} bbsId={bbsId} setAlert={setAlert} />
            )}
            {commentList.length > 0 && (<div className='border-b border-solid border-gray-300'>
                {commentList.map(comment => (
                    <CommentItem refetch={refetch} key={comment.id} {...comment} loop={loop} articleId={articleId} bbsId={bbsId} setAlert={setAlert}/>
                ))}

            </div>)}
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
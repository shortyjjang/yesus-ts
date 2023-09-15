import { userInfo } from '@/atom/user'
import { useRecoilValue } from 'recoil'
import AddComment from './add'
import CommentItem from './list'
import { useMutation } from 'react-query'
import { Api, ApiResponseType } from '@/util/api'
import Cookies from 'js-cookie'

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
    const saveComment = useMutation('saveComment',
        async (data:AddCommentType) => {
            const request:ApiResponseType = await Api.post(
              (data.id === undefined || data.parentId) 
                ? `/api/board/v1/comment/create` 
                : `/api/board/v1/comment/update`,
              data,
              {
                headers: { Authorization: Cookies.get("accessToken") },
              }
            );
            return request
        },
        {
            onSuccess: (data, variables) => {
                if (data?.meta?.resultMsg) {
                    setAlert(data.meta.resultMsg);
                    return;
                }
                refetch()
            },
        }
    )
    return (
        <div  className={"mt-20"}>
            {!user.username || commentList.findIndex(comment => comment.createBy === user.username) < 0 && (
                <AddComment save={({ comment }) => {
                        if(!user.username){
                            setAlert('로그인 후 이용해주세요')
                            return;
                        }
                        const data = { // 등록
                            articleId: articleId,
                            contents: comment,
                            customerMallCd: 'YESUS',
                            customerUid: user.username,
                            managementId: bbsId,
                        }
                        saveComment.mutate(data)
                    }
                } refetch={refetch} setAlert={setAlert} />
            )}
            {commentList.length > 0 && (<div className='border-b border-solid border-gray-300'>
                {commentList.map(comment => (
                    <CommentItem refetch={refetch} key={comment.id} 
                    {...comment} loop={loop} articleId={articleId} bbsId={bbsId} setAlert={setAlert}
                        save={( comment, parentId = '' ) => {
                                
                            if(!user.username){
                                setAlert('로그인 후 이용해주세요')
                                return;
                            }
                            const data = parentId ? { // 대댓글 등록
                                articleId: articleId,
                                contents: comment,
                                customerMallCd: 'YESUS',
                                customerUid: user.username,
                                managementId: bbsId,
                                parentId: parentId
                            } :{// 수정
                                contents: comment,
                                customerMallCd: 'YESUS',
                                customerUid: user.username,
                                id: comment.id,
                            }
                            saveComment.mutate(data)
                        }}
                    />
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
type AddCommentType = {
    articleId?: string,
    contents: string,
    customerMallCd: string,
    customerUid: string,
    managementId?: number,
    id?: number,
    parentId?: number
  }
import { userInfo } from '@/atom/user'
import { useRecoilValue } from 'recoil'
import AddComment from '@/layout/board/post/comment/add'
import { useMutation } from 'react-query'
import { Api, ApiResponseType } from '@/util/api'
import Cookies from 'js-cookie'
import RecipecommentItem from './comment'
import PopupContainer from '@/components/popup'
import { useState } from 'react'

export default function RecipeComment({
    commentList,
    recipeId,
    setAlert,
    refetch
}:{
    commentList: commentType[]
    recipeId: number
    setAlert: (msg: string) => void
    refetch: () => void
}) {
    const user = useRecoilValue(userInfo)
    const [edit, setEdit] = useState(false)
    const removeComment = useMutation('removeComment',
      async (id:number) => {
        let body = {
          customerMallCd: "YESUS",
          customerUid: user.username,
          rcsId: id,
        };
        const request:ApiResponseType = await Api.post(`/api/v1/recipe-score/delete`, body, {
        headers: {
            Authorization: Cookies.get("accessToken"),
        },
        });
        return request;
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
    const saveComment = useMutation('saveComment',
        async (data:AddCommentType) => {
            const request:ApiResponseType = await Api.post(
              (data.recipeId) 
                ? `/api/v1/recipe-score/create` 
                : `/api/v1/recipe-score/update`,
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
        <div className='py-8'>
            {!user.username || commentList.findIndex(comment => comment.customerMallId === user.username) < 0 ? (
                <div className='mb-16'><AddComment mukTypeMobileThumbnailImagePath={'/images/mukbti_v2_ready.webp'}
                save={({ comment, score }) => {
                        if(!user.username){
                            setAlert('로그인 후 이용해주세요')
                            return;
                        }
                        const data = { // 등록
                            customerMallCd: "YESUS",
                            customerUid: user.username,
                            rcsDesc: comment,
                            rcsScore: score,
                            recipeId: recipeId,
                        }
                        saveComment.mutate(data)
                    }
                } placeholder="여러분만의 레시피 팁이나 다양한 정보를 공유해주세요!"
                refetch={refetch} setAlert={setAlert} /></div>
            ): edit && <PopupContainer onClose={() => setEdit(false)}>
                <AddComment 
                    contents={commentList[commentList.findIndex(comment => comment.customerMallId === user.username)].description}
                    closeComment={() => setEdit(false)}
                    setAlert={setAlert}
                    refetch={refetch}
                    mukTypeMobileThumbnailImagePath={commentList[commentList.findIndex(comment => comment.customerMallId === user.username)].mukTypeMobileThumbnailImagePath
                        ? `${process.env.NEXT_PUBLIC_IMG_SERVER}/${
                        commentList[commentList.findIndex(comment => comment.customerMallId === user.username)].mukTypeMobileThumbnailImagePath
                    }`:'/images/mukbti_v2_ready.webp'}
                    save={({ comment, score }) => {
                            
                        if(!user.username){
                            setAlert('로그인 후 이용해주세요')
                            return;
                        }
                        const data = { // 수정
                            customerMallCd: "YESUS",
                            customerUid: user.username,
                            rcsDesc: comment,
                            rcsScore: score,
                            rcsId: commentList[commentList.findIndex(comment => comment.customerMallId === user.username)].rcsId,
                        }
                        setEdit(false)
                        saveComment.mutate(data)
                    }}
                    removeComment={() => removeComment.mutate(
                        commentList[commentList.findIndex(comment => comment.customerMallId === user.username)].rcsId
                    )}
                />
            </PopupContainer>}
            {commentList.length > 0 && (<div className='border-b border-solid border-gray-300'>
                {commentList.map(comment => (
                    <RecipecommentItem refetch={refetch} key={comment.rcsId} 
                        {...comment} setAlert={setAlert}
                        setEdit={setEdit}
                    />
                ))}

            </div>)}
        </div>
    )
}
export type commentType ={
    rcsId: number,
    customerName: string,
    customerMallId: string,
    mukTypeMobileThumbnailImagePath:string,
    badCount: string,
    goodCount: string,
    rcsScore: string,
    description: string,
    createTime: string,
    loginUserPreferType: string
}
type AddCommentType = {
    customerMallCd: string,
    customerUid: string,
    rcsDesc: string,
    rcsScore: number,
    recipeId?: number,
    rcsId?: number,
}
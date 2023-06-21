import { userInfo } from "@/atom/user";
import Button from "@/components/button";
import { Api, ApiResponseType } from "@/util/api";
import { watch } from "fs";
import Cookies from "js-cookie";
import { use } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useRecoilValue } from "recoil";

export default function AddComment({
    contents,
    id,
    setAlert,
    closeComment,
    articleId,
    bbsId
}:{
    contents?:string
    id?: number
    setAlert: (msg: string) => void
    closeComment?: () => void
    articleId: string
    bbsId: number
}) {
    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            comment: contents ? contents : "",
        }
    });
    const comment = watch("comment");
    const user = useRecoilValue(userInfo)
    const saveComment = useMutation('saveComment',
        async (data:AddCommentType) => {
            const request:ApiResponseType = await Api.post(
              contents 
                ? `/api/board/v1/comment/update` 
                : `/api/board/v1/comment/create`,
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
                closeComment && closeComment()
            },
        }
    )
    const removeComment = useMutation('removeComment',
      async (id:number) => {
          const request: ApiResponseType = await Api.post(
            `/api/board/v1/comment/delete`,
            {
              customerMallCd: "YESUS",
              customerUid: user.username,
              id: id,
            },
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
              closeComment && closeComment()
          },
      }
    )
    
    return (
        <div>
            <form onSubmit={handleSubmit(({ comment }) => {
                    if(!user.username){
                        setAlert('로그인 후 이용해주세요')
                        return;
                    }
                    const data = contents 
                    ? {// 수정
                        contents: comment,
                        customerMallCd: 'YESUS',
                        customerUid: user.username,
                        id: id,
                    }:{ // 등록
                        articleId: articleId,
                        contents: comment,
                        customerMallCd: 'YESUS',
                        customerUid: user.username,
                        managementId: bbsId,
                    }
                    saveComment.mutate(data)
                }
            )}>
                <div className="comment_div">
                    {contents && <label>입력 내용</label>}
                    <textarea
                        {...register("comment", { required: true })}
                        placeholder="댓글을 입력해주세요"
                        onFocus={() => !user.username && setAlert('로그인 후 이용해주세요')}
                    ></textarea>
                </div>
                <div className="comment_btn">
                    {!contents ? (
                        <Button
                            className="btn-dimmend"
                            onClick={() => closeComment && closeComment()}
                        >
                        취소
                        </Button>
                    ) : (
                        <Button onClick={() => id && removeComment.mutate(id)}>
                        삭제하기
                        </Button>
                    )}
                    <Button
                        type="submit"
                        styleType={comment ? "primary": "default"}
                    >
                        등록
                    </Button>
                </div>

            </form>
        </div>
    )
}

type AddCommentType = {
    articleId?: string,
    contents: string,
    customerMallCd: string,
    customerUid: string,
    managementId?: number,
    id?: number,
  }